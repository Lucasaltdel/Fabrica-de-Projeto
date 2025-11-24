# 🔧 Solução para Erro 404 no Endpoint

## Problema
O endpoint `POST /leads/{id}/proposta` está retornando 404 (Not Found).

## Verificações Necessárias

### 1. ✅ Verificar se o Backend está Rodando

```bash
cd backend
dotnet run
```

**Deve mostrar:**
```
Now listening on: http://localhost:5237
```

### 2. ✅ Verificar se o Endpoint Aparece no Swagger

1. Acesse: `http://localhost:5237`
2. Procure por: `POST /leads/{id}/proposta`
3. Se **NÃO aparecer**, o controller não está sendo carregado

### 3. ✅ Testar Endpoint Diretamente no Swagger

1. No Swagger, encontre `POST /leads/{id}/proposta`
2. Clique em "Try it out"
3. Coloque `id = 1`
4. Body:
```json
{
  "slides": "teste",
  "pdfUrl": "data:application/pdf;base64,teste",
  "statusValidacao": "Aguardando Validação"
}
```
5. Clique em "Execute"

### 4. ✅ Verificar Logs do Backend

Quando você tentar enviar, os logs devem aparecer:
```
[LeadsController] POST /leads/1/proposta chamado
[LeadsController] Body recebido: ...
```

**Se os logs NÃO aparecerem**, o endpoint não está sendo chamado.

## Possíveis Soluções

### Solução 1: Reiniciar o Backend

O backend pode não ter carregado o controller corretamente:

```bash
# Pare o backend (Ctrl+C)
# Inicie novamente
cd backend
dotnet run
```

### Solução 2: Verificar se o Controller Está no Diretório Correto

O arquivo deve estar em:
```
backend/Api/Controllers/LeadsController.cs
```

### Solução 3: Verificar Namespace

O namespace deve ser:
```csharp
namespace ProjetoApiPT.Api.Controllers;
```

### Solução 4: Limpar e Recompilar

```bash
cd backend
dotnet clean
dotnet build
dotnet run
```

### Solução 5: Verificar se Há Erros de Compilação

```bash
cd backend
dotnet build
```

**Não deve haver erros!**

## Teste Alternativo com cURL

Se o Swagger não estiver disponível, teste com cURL:

```bash
curl -X POST http://localhost:5237/leads/1/proposta ^
  -H "Content-Type: application/json" ^
  -d "{\"slides\":\"teste\",\"pdfUrl\":\"teste.pdf\",\"statusValidacao\":\"Aguardando Validação\"}"
```

## Se Nada Funcionar

1. Verifique se há outros endpoints funcionando (ex: `GET /leads`)
2. Se `GET /leads` funcionar, o problema é específico do `POST /leads/{id}/proposta`
3. Verifique os logs do backend para ver se há exceções

## Próximos Passos

Após verificar tudo acima, me informe:
1. O endpoint aparece no Swagger?
2. Os logs aparecem no console do backend?
3. Há algum erro de compilação?

