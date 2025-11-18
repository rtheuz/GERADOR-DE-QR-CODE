import qrcode
import os

# ====== DADOS DO PIX ======
chave_pix = "10684825000126"          # Pode ser CNPJ, CPF, e-mail ou chave aleatória
nome_recebedor = "TUBA FERRAMENTARIA LTDA"
cidade_recebedor = "SAO BERNARDO DO CAMPO"  # sem acento
valor = ""                             # deixe vazio para valor aberto
descricao = "PAGAMENTO DE SERVICO"     # opcional

# ====== FUNÇÃO CRC16 ======
def crc16(payload: str) -> str:
    polinomio = 0x1021
    resultado = 0xFFFF
    for byte in payload.encode("utf-8"):
        resultado ^= byte << 8
        for _ in range(8):
            if resultado & 0x8000:
                resultado = (resultado << 1) ^ polinomio
            else:
                resultado <<= 1
            resultado &= 0xFFFF
    return format(resultado, "04X")

# ====== FUNÇÃO GERA PAYLOAD PIX ======
def gerar_payload_pix(chave, nome, cidade, valor="", descricao=""):
    nome = nome[:25]
    cidade = cidade[:15]

    # Merchant Account Information (ID 26)
    gui = "BR.GOV.BCB.PIX"
    gui_field = f"00{len(gui):02d}{gui}"
    chave_field = f"01{len(chave):02d}{chave}"
    descricao_field = f"02{len(descricao):02d}{descricao}" if descricao else ""
    merchant_account_info = f"{gui_field}{chave_field}{descricao_field}"
    campo26 = f"26{len(merchant_account_info):02d}{merchant_account_info}"

    # Valor, se existir
    campo54 = f"54{len(valor):02d}{valor}" if valor else ""

    # Monta payload base (sem CRC)
    payload_sem_crc = (
        f"000201"       # Início
        f"010212"       # QR estático
        f"{campo26}"    # Conta PIX
        f"52040000"     # Código de categoria
        f"5303986"      # Moeda (986 = BRL)
        f"{campo54}"    # Valor (opcional)
        f"5802BR"       # País
        f"59{len(nome):02d}{nome}"
        f"60{len(cidade):02d}{cidade}"
        f"62070503***"  # ID adicional (livre)
        f"6304"         # Placeholder CRC
    )

    # Calcula CRC e adiciona
    crc = crc16(payload_sem_crc)
    return payload_sem_crc + crc

# ====== GERA QR CODE ======
dados = gerar_payload_pix(chave_pix, nome_recebedor, cidade_recebedor, valor, descricao)

qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(dados)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")

# ====== SALVAR ======
caminho_arquivo = os.path.join(os.path.dirname(__file__), "pixCNPJ.png")
img.save(caminho_arquivo)

print("✅ QR Code PIX gerado com sucesso!")
print("📁 Arquivo salvo em:", caminho_arquivo)
print("\n🔍 Payload PIX:\n", dados)
