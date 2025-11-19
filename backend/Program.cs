using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ProjetoApiPT.Domain.Ports;
using ProjetoApiPT.Infrastructure.Data;
using ProjetoApiPT.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ==================== CONFIGURAÇÃO DE SERVIÇOS ====================

// Controladores
builder.Services.AddControllers();

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API de Gestão de Clientes, Propostas e Modelos",
        Version = "v1",
        Description = "API RESTful para gerenciar Clientes, Propostas, Modelos, Envios de Formulários, Processos de Modelos e Usuários."
    });
});

// ==================== BANCO DE DADOS ====================

// String de conexão do appsettings.json, com fallback para SQLite local
var stringConexao = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Data Source=app.db";

// Registra o contexto do banco usando SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(stringConexao)
);

// ==================== REPOSITÓRIOS ====================
builder.Services.AddScoped<IClienteRepositorio, ClienteRepositorio>();
builder.Services.AddScoped<IPropostaRepositorio, PropostaRepositorio>();
builder.Services.AddScoped<IModeloRepositorio, ModeloRepositorio>();
builder.Services.AddScoped<IEnvioFormularioRepositorio, EnvioFormularioRepositorio>();
builder.Services.AddScoped<IProcessoModeloRepositorio, ProcessoModeloRepositorio>();
builder.Services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();

// ==================== CORS ====================
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTodas", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ==================== CONSTRUÇÃO DA APLICAÇÃO ====================
var app = builder.Build();

// ==================== PIPELINE ====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseCors("PermitirTodas");
app.MapControllers();

// ==================== MIGRAÇÕES AUTOMÁTICAS ====================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate(); // Aplica migrations automaticamente
}

// ==================== INICIALIZAÇÃO ====================
app.Run();
