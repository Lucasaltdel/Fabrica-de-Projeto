# 🔍 Como Testar o Endpoint

## Verificar se o Backend Está Rodando

1. **Acesse o Swagger:**
   ```
   http://localhost:5237
   ```

2. **Procure pelo endpoint:**
   - `POST /leads/{id}/proposta`
   - Deve aparecer na lista de endpoints

3. **Teste diretamente no Swagger:**
   - Clique em "Try it out"
   - Coloque um ID válido (ex: 1)
   - Adicione o body:
   ```json
   {
     "slides": "teste",
     "pdfUrl": "teste.pdf",
     "statusValidacao": "Aguardando Validação"
   }
   ```
   - Clique em "Execute"

## Verificar Logs do Backend

Quando você tentar enviar uma proposta, os logs devem aparecer no console do backend:

```
[LeadsController] POST /leads/1/proposta chamado
[LeadsController] Body recebido: ...
[LeadsController] Cliente encontrado: ...
[LeadsController] Proposta criada com sucesso. ID: ...
```

## Testar com cURL

```bash
curl -X POST http://localhost:5237/leads/1/proposta \
  -H "Content-Type: application/json" \
  -d '{
    "slides": "teste de slides",
    "pdfUrl": "http://exemplo.com/proposta.pdf",
    "statusValidacao": "Aguardando Validação"
  }'
```

## Possíveis Problemas

1. **Backend não está rodando:**
   - Verifique se está rodando na porta 5237
   - Veja os logs do console

2. **Rota não encontrada:**
   - Verifique se o controller está sendo carregado
   - Veja se aparece no Swagger

3. **CORS:**
   - Já está configurado para permitir todas as origens
   - Se ainda houver problema, verifique os logs do navegador

4. **Cliente não existe:**
   - Verifique se o ID do lead existe no banco
   - Tente com um ID diferente

