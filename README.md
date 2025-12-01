# 📋 Task Scheduler - Agendador de Tarefas

![Version](https://img.shields.io/badge/version-2.0. 0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA](https://img.shields. io/badge/PWA-Ready-purple.svg)

**Task Scheduler** é um aplicativo web progressivo (PWA) moderno e intuitivo para gerenciar suas tarefas diárias com notificações inteligentes, sincronização offline e design responsivo.

## ✨ Funcionalidades

### 🎯 Core Features
- ✅ **Criar, editar e excluir tarefas** com facilidade
- 📅 **Organização por data** (Hoje, Amanhã, Esta Semana, Atrasadas)
- 🏷️ **Categorias personalizadas** (Trabalho, Pessoal, Estudos, Saúde, Compras)
- ⚡ **Prioridades** (Alta, Média, Baixa)
- 🔍 **Busca e filtros avançados**
- 📊 **Dashboard com estatísticas** em tempo real

### 🔔 Notificações Inteligentes
- 📲 **Notificações push** no navegador e mobile
- ⏰ **Lembretes automáticos** (30 min, 15 min, 5 min antes)
- ⚠️ **Alertas de tarefas atrasadas**
- 📋 **Resumo diário** das tarefas pendentes

### 💡 Design & UX
- 🎨 **Design moderno e minimalista**
- 🌙 **Modo escuro/claro** automático
- 📱 **100% Responsivo** (mobile-first)
- ⚡ **Animações suaves** e feedback visual
- ♿ **Acessível** (WCAG 2.1)

### 🚀 PWA Features
- 📲 **Instalável** como app nativo
- 🔄 **Funciona offline** completamente
- ⚡ **Carregamento instantâneo**
- 💾 **Cache inteligente**
- 🔄 **Sincronização em background**

### 📤 Import/Export
- 💾 **Backup automático** no localStorage
- 📥 **Importar tarefas** de arquivo JSON
- 📤 **Exportar tarefas** para backup

## 🚀 Como Usar

### Instalação Local

1. **Clone o repositório**
```bash
git clone https://github.com/rtheuz/AGENDADOR-DE-TAREFAS.git
cd AGENDADOR-DE-TAREFAS
```

2. **Abra o arquivo index.html**
   - Simplesmente abra `index.html` em um navegador moderno
   - Ou use um servidor local:

```bash
# Com Python
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Com PHP
php -S localhost:8000
```

3. **Acesse no navegador**
```
http://localhost:8000
```

### Instalar como PWA

#### No Desktop (Chrome/Edge)
1. Clique no ícone de instalação (➕) na barra de endereços
2. Ou vá em **Menu → Instalar Task Scheduler**

#### No Android
1. Abra no Chrome/Firefox
2. Toque em **Menu (⋮) → Instalar aplicativo**
3. Confirme a instalação

#### No iOS/Safari
1. Toque no botão **Compartilhar** (📤)
2. Role e toque em **Adicionar à Tela Inicial**
3. Confirme

## 📱 Funcionalidades Detalhadas

### Criar Tarefa Rápida
1.  Clique no botão **+** (FAB) no canto inferior direito
2. Digite o título da tarefa
3.  Selecione uma data rápida (Hoje, Amanhã, Próxima Semana)
4. Clique em **Salvar**

### Criar Tarefa Completa
1. Clique no botão **+**
2. Preencha o título
3. Clique em **Mais opções** para expandir
4. Adicione:
   - Descrição detalhada
   - Horário específico
   - Prioridade
   - Categoria
5. Salve a tarefa

### Filtros e Buscas
- **Abas**: Filtre por Hoje, Esta Semana ou Todas
- **Busca**: Digite no campo de pesquisa
- **Filtros**: Use os dropdowns para filtrar por:
  - Status (Ativas/Concluídas)
  - Prioridade (Alta/Média/Baixa)
  - Categoria
  - Data

### Visualizações
- **Lista**: Visualização compacta e organizada
- **Cards**: Visualização em grade com mais destaque

### Notificações
1.  Clique em **Menu (☰)** no mobile ou **🔔** no header
2. Clique em **Ativar Notificações**
3.  Permita no navegador
4. Você receberá:
   - Lembrete 30 min antes
   - Lembrete 15 min antes
   - Lembrete 5 min antes
   - Alerta quando estiver atrasada

## 🛠️ Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Design moderno com CSS Variables
- **JavaScript ES6+** - Lógica da aplicação
- **Service Worker** - Cache e offline

### APIs Utilizadas
- **Web Notifications API** - Notificações do navegador
- **Service Worker API** - PWA e offline
- **LocalStorage API** - Persistência de dados
- **Push API** - Notificações push
- **Web App Manifest** - Instalação PWA

### Design Patterns
- **Mobile-First** - Design responsivo
- **Progressive Enhancement** - Funcionalidades incrementais
- **Offline First** - Funciona sem internet
- **ARIA** - Acessibilidade

## 📂 Estrutura de Arquivos

```
AGENDADOR-DE-TAREFAS/
│
├── index.html              # Página principal
├── manifest.json           # Configuração PWA
├── service-worker.js       # Service Worker para offline
│
├── css/
│   └── style.css          # Estilos principais
│
├── js/
│   ├── app.js             # Lógica principal
│   ├── storage.js         # Gerenciamento de dados
│   ├── notifications.js   # Sistema de notificações
│   ├── push-notifications.js # Push notifications
│   └── pwa-install.js     # Instalação PWA
│
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128. png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
│
└── README.md              # Este arquivo
```

## 🎨 Personalização

### Alterar Cores (CSS Variables)
Edite as variáveis no arquivo `css/style.css`:

```css
:root {
    --primary-color: #6366f1;     /* Cor principal */
    --success-color: #10b981;     /* Cor de sucesso */
    --warning-color: #f59e0b;     /* Cor de aviso */
    --danger-color: #ef4444;      /* Cor de perigo */
}
```

### Adicionar Novas Categorias
Edite no arquivo `js/app.js`:

```javascript
const categoryIcons = {
    work: '💼',
    personal: '👤',
    study: '📚',
    health: '❤️',
    shopping: '🛒',
    other: '📌',
    // Adicione aqui
    fitness: '🏋️',
    finance: '💰'
};
```

## 🐛 Troubleshooting

### Notificações não funcionam
- Verifique se deu permissão no navegador
- Confirme que o site está em HTTPS ou localhost
- Teste em modo anônimo para descartar extensões

### App não instala
- Use um navegador compatível (Chrome, Edge, Safari, Firefox)
- Verifique se está em HTTPS
- Limpe o cache e tente novamente

### Dados não salvam
- Verifique se o localStorage está habilitado
- Confirme que não está em modo anônimo
- Verifique o espaço de armazenamento

### PWA não funciona offline
- Verifique se o Service Worker está registrado
- Abra DevTools → Application → Service Workers
- Force uma atualização do Service Worker

## 🔒 Privacidade

- ✅ **Todos os dados são armazenados localmente** no seu dispositivo
- ✅ **Nenhuma informação é enviada para servidores externos**
- ✅ **Sem rastreamento ou analytics**
- ✅ **Sem cookies de terceiros**
- ✅ **100% offline-first**

## 📈 Roadmap

### Versão 2.1
- [ ] Suporte a subtarefas
- [ ] Temas personalizados
- [ ] Widgets para Android
- [ ] Estatísticas avançadas

### Versão 2.2
- [ ] Sincronização em nuvem (opcional)
- [ ] Compartilhamento de tarefas
- [ ] Integração com calendários
- [ ] Suporte a anexos

### Versão 3.0
- [ ] Colaboração em tempo real
- [ ] Modo Pomodoro integrado
- [ ] IA para sugestões de tarefas
- [ ] Voz para criar tarefas

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3.  Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4.  Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**rtheuz**
- GitHub: [@rtheuz](https://github.com/rtheuz)

## 🙏 Agradecimentos

- Ícones: Emojis nativos do sistema
- Fontes: [Inter](https://fonts.google.com/specimen/Inter) do Google Fonts
- Inspiração: Modern productivity apps

---

**⭐ Se você gostou deste projeto, considere dar uma estrela no GitHub! **

Made with ❤️ and ☕ by rtheuz