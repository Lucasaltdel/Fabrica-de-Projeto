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

// Desabilitar redirecionamento HTTPS em desenvolvimento para evitar problemas
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseCors("PermitirTodas");

app.UseAuthorization(); // Adicionar UseAuthorization é uma boa prática

app.MapControllers();

// ==================== MIGRAÇÕES AUTOMÁTICAS ====================
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.Migrate(); // Aplica migrations automaticamente
    }
    catch (System.InvalidOperationException ex)
    {
        // Se houver pending model changes (sem dotnet-ef), continuamos com ajustes manuais
        Console.WriteLine("Aviso: migração automática falhou: " + ex.Message);
    }

    // Garantia extra para ambientes sem dotnet-ef: adiciona colunas necessárias
    try
    {
        var conn = dbContext.Database.GetDbConnection();
        conn.Open();
        using (var cmd = conn.CreateCommand())
        {
            cmd.CommandText = "PRAGMA table_info('Propostas');";
            var cols = new System.Collections.Generic.List<string>();
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    cols.Add(reader.GetString(1));
                }
            }

            if (!cols.Contains("Slides"))
            {
                cmd.CommandText = "ALTER TABLE Propostas ADD COLUMN Slides TEXT;";
                cmd.ExecuteNonQuery();
            }
            if (!cols.Contains("PdfUrl"))
            {
                cmd.CommandText = "ALTER TABLE Propostas ADD COLUMN PdfUrl TEXT;";
                cmd.ExecuteNonQuery();
            }
            if (!cols.Contains("ClienteId"))
            {
                cmd.CommandText = "ALTER TABLE Propostas ADD COLUMN ClienteId INTEGER DEFAULT 0;";
                cmd.ExecuteNonQuery();
            }
        }
        conn.Close();
    }
    catch (System.Exception ex)
    {
        // Se algo falhar aqui, não interrompe a aplicação — logs para diagnóstico
        Console.WriteLine("Aviso: não foi possível aplicar alterações manuais na tabela Propostas: " + ex.Message);
    }
}

// ==================== INICIALIZAÇÃO ====================
app.Run();
