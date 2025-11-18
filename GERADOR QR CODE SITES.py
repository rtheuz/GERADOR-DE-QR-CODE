import qrcode
import os

# ====== CONFIGURAÇÕES ======
# Altere o link abaixo para o que quiser codificar:
dados = "http://paineltuba.netlify.app"

# ====== GERAÇÃO DO QR CODE ======
qr = qrcode.QRCode(
    version=None,  # automático (define tamanho conforme dados)
    error_correction=qrcode.constants.ERROR_CORRECT_H,  # alta correção de erro
    box_size=10,  # tamanho de cada "quadradinho"
    border=4,     # margem branca ao redor
)

qr.add_data(dados)
qr.make(fit=True)

# Cria imagem em memória
img = qr.make_image(fill_color="black", back_color="white")

# ====== SALVAR NA MESMA PASTA DO SCRIPT ======
caminho_arquivo = os.path.join(os.path.dirname(__file__), "APP TUBA.png")
img.save(caminho_arquivo)

print("✅ QR Code gerado com sucesso!")
print("📁 Arquivo salvo em:", caminho_arquivo)
