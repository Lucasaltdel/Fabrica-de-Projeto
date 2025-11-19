using Microsoft.AspNetCore.Mvc;
using ProjetoApiPT.Domain.Ports;
using ProjetoApiPT.Domain.Entities;

namespace ProjetoApiPT.Api.Controllers;

[ApiController]
[Route("leads")]
public class LeadsController : ControllerBase
{
    private readonly IClienteRepositorio _clienteRepositorio;

    public LeadsController(IClienteRepositorio clienteRepositorio)
    {
        _clienteRepositorio = clienteRepositorio;
    }

    private static object MapClienteToLead(Cliente c)
    {
        return new
        {
            id = c.Id,
            clientName = c.Nome,
            email = c.Email,
            phone = "",
            company = c.Nome,
            message = "",
            servico = "",
            data = c.DataCadastro.ToString("yyyy-MM-dd")
        };
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var clientes = await _clienteRepositorio.ObterTodosAsync();
        var list = clientes.Select(MapClienteToLead);
        // If no clients in DB, return sample data
        if (!list.Any())
        {
            var sample = new[] {
                new { id = 1, clientName = "Acme Corp", email = "contato@acme.com", phone = "+55 11 99999-0001", company = "Acme Corp", message = "Interessado em pacote empresarial", servico = "Desenvolvimento Web", data = "2025-11-01" },
                new { id = 2, clientName = "Beta Ltda", email = "vendas@beta.com", phone = "+55 21 98888-0002", company = "Beta Ltda", message = "Solicitou proposta para design", servico = "Design UX/UI", data = "2025-10-28" },
                new { id = 3, clientName = "Gamma S.A.", email = "hello@gamma.com", phone = "+55 31 97777-0003", company = "Gamma S.A.", message = "Consulta sobre manutenção", servico = "Suporte e manutenção", data = "2025-10-20" }
            };
            return Ok(sample);
        }

        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cliente = await _clienteRepositorio.ObterPorIdAsync(id);
        if (cliente is null)
        {
            // fallback: try sample
            var sample = new[] {
                new { id = 1, clientName = "Acme Corp", email = "contato@acme.com", phone = "+55 11 99999-0001", company = "Acme Corp", message = "Interessado em pacote empresarial", servico = "Desenvolvimento Web", data = "2025-11-01" },
                new { id = 2, clientName = "Beta Ltda", email = "vendas@beta.com", phone = "+55 21 98888-0002", company = "Beta Ltda", message = "Solicitou proposta para design", servico = "Design UX/UI", data = "2025-10-28" },
                new { id = 3, clientName = "Gamma S.A.", email = "hello@gamma.com", phone = "+55 31 97777-0003", company = "Gamma S.A.", message = "Consulta sobre manutenção", servico = "Suporte e manutenção", data = "2025-10-20" }
            };
            var found = sample.FirstOrDefault(s => s.id == id);
            if (found is null) return NotFound(new { message = "Lead not found" });
            return Ok(found);
        }

        return Ok(MapClienteToLead(cliente));
    }
}
