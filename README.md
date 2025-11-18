# GERADOR DE QR CODE

🔲 Gerador de QR Code em Python para PIX e URLs

## 📋 Descrição

Este repositório contém dois scripts Python para geração de QR Codes:
- **Gerador de QR Code PIX**: Cria QR Codes para pagamentos PIX com suporte a valores fixos ou abertos
- **Gerador de QR Code para Sites**: Cria QR Codes para URLs e links

## 🚀 Funcionalidades

### 1. Gerador PIX (`GERADOR QR CODE PIX.py`)
- ✅ Suporte para chaves PIX (CNPJ, CPF, e-mail ou chave aleatória)
- ✅ Geração automática de payload PIX com CRC16
- ✅ Valores fixos ou abertos (valor variável)
- ✅ Descrição personalizada do pagamento
- ✅ Alta correção de erros (ERROR_CORRECT_H)
- ✅ Salva automaticamente como imagem PNG

### 2. Gerador de URLs (`GERADOR QR CODE SITES.py`)
- ✅ Gera QR Code para qualquer URL ou texto
- ✅ Configuração simples e direta
- ✅ Alta correção de erros
- ✅ Exportação automática em PNG

## 📦 Dependências

```bash
pip install qrcode[pil]
```

## 💻 Como Usar

### Gerar QR Code PIX

1. Abra o arquivo `GERADOR QR CODE PIX.py`
2. Configure os dados do PIX:

```python
chave_pix = "10684825000126"          # Sua chave PIX
nome_recebedor = "TUBA FERRAMENTARIA LTDA"
cidade_recebedor = "SAO BERNARDO DO CAMPO"
valor = ""                             # Deixe vazio para valor aberto
descricao = "PAGAMENTO DE SERVICO"
```

3. Execute o script:
```bash
python "GERADOR QR CODE PIX.py"
```

4. O QR Code será salvo como `pixCNPJ.png` na mesma pasta do script

### Gerar QR Code para Sites

1. Abra o arquivo `GERADOR QR CODE SITES.py`
2. Altere a URL desejada:

```python
dados = "http://paineltuba.netlify.app"
```

3. Execute o script:
```bash
python "GERADOR QR CODE SITES.py"
```

4. O QR Code será salvo como `APP TUBA.png` na mesma pasta do script

## 🛠️ Tecnologias

- Python 3.x
- qrcode library
- PIL (Pillow)

## 📁 Estrutura do Projeto

```
GERADOR-DE-QR-CODE/
│
├── GERADOR QR CODE PIX.py      # Script para gerar QR Code PIX
├── GERADOR QR CODE SITES.py    # Script para gerar QR Code de URLs
└── README.md                    # Documentação
```

## ⚙️ Configurações Avançadas

Ambos os scripts utilizam:
- `version=None`: Tamanho automático baseado nos dados
- `error_correction=ERROR_CORRECT_H`: Alta correção de erros (~30%)
- `box_size=10`: Tamanho de cada módulo do QR Code
- `border=4`: Margem branca ao redor (mínimo recomendado)

## 📝 Notas

- O gerador PIX implementa o padrão EMV (Europay, Mastercard e Visa) com CRC16
- As imagens são geradas em preto e branco para máxima compatibilidade
- Os QR Codes podem ser lidos por qualquer aplicativo de pagamento PIX ou leitor de QR Code padrão

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 👤 Autor

**rtheuz**

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
