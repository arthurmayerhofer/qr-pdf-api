# QR-PDF API

API para gerar QR Code em arquivos PDF.

Esta API permite que você faça o upload de um arquivo PDF e um texto opcional para gerar um QR Code no PDF enviado. O PDF resultante é então disponibilizado para download.

## Uso

Siga os passos abaixo para configurar e executar a API.

### Pré-requisitos

Certifique-se de ter o Node.js instalado em sua máquina.

- Node.js (v22.3.0 ou superior)
- npm (normalmente vem com o Node.js)

### Instalação

1. Clone este repositório:

git clone https://github.com/seu-nome-de-usuario/qr-pdf-api.git

2. Navegue até o diretório do projeto:

cd qr-pdf-api

3. Instale as dependências:

npm install


### Configuração

A API usa o multer para lidar com uploads de arquivos. Certifique-se de que a pasta `uploads` exista na raiz do projeto para armazenamento temporário de arquivos.

### Executando a API

Para iniciar o servidor da API, execute o seguinte comando:

npm start


A API estará disponível em `http://localhost:3000`.

### Endpoint

- **POST /api/qrcode**

  Endpoint para gerar um QR Code em um arquivo PDF.

  **Parâmetros da Requisição:**

  - `pdfFile`: Arquivo PDF a ser processado (enviado via form-data)
  - `text` (opcional): Texto para inserir no QR Code

  **Exemplo de Uso:**

  ```bash
  curl -X POST http://localhost:3000/api/qrcode \
       -F pdfFile=@caminho/para/seu/arquivo.pdf \
       -F text=https://www.exemplo.com
