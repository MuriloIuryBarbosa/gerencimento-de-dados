// Teste da API de verificação de acesso
fetch('/api/admin/check-access')
  .then(response => response.json())
  .then(data => console.log('Resposta da API:', data))
  .catch(error => console.error('Erro:', error));
