# 📋 TaskScheduler Pro

> Sistema profissional de gerenciamento de tarefas e eventos com interface moderna e intuitiva

![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![PWA](https://img.shields. io/badge/PWA-Ready-purple.svg)

## ✨ Características Principais

### 🎯 Funcionalidades Core

- **Gerenciamento Completo de Tarefas**
  - Criar, editar, excluir e marcar como concluída
  - Adicionar descrições detalhadas
  - Definir data e horário específicos
  - Configurar lembretes personalizados

- **Sistema de Prioridades**
  - 🔴 Alta prioridade
  - 🟡 Média prioridade
  - 🟢 Baixa prioridade

- **Categorização Inteligente**
  - 💼 Trabalho
  - 👤 Pessoal
  - 📚 Estudos
  - ❤️ Saúde
  - 🛒 Compras
  - 📌 Outros

### 📊 Dashboard & Estatísticas

- **Visão Geral em Tempo Real**
  - Total de tarefas
  - Tarefas concluídas
  - Tarefas pendentes
  - Tarefas atrasadas
  - Taxa de conclusão com gráfico circular

- **Múltiplas Visualizações**
  - 📅 Hoje
  - 📆 Esta Semana
  - 🔜 Próximas
  - 📋 Todas as Tarefas
  - ✅ Concluídas

### 🔔 Sistema de Notificações

- **Lembretes Configuráveis**
  - No horário da tarefa
  - 5, 15, 30 minutos antes
  - 1 hora antes
  - 1 dia antes

- **Notificações Inteligentes**
  - Alertas de tarefas atrasadas
  - Resumo diário
  - Notificações push

### 📅 Calendário Integrado

- Visualização mensal interativa
- Indicadores de dias com tarefas
- Navegação rápida entre meses
- Filtro por data

### 🎨 Design & UX

- **Interface Profissional**
  - Design system completo
  - Componentes reutilizáveis
  - Animações suaves
  - Feedback visual em todas as ações

- **Tema Escuro/Claro**
  - Alternância com um clique
  - Preferência salva localmente
  - Cores otimizadas para cada modo

- **Responsivo & Mobile-First**
  - Adaptável a qualquer tamanho de tela
  - Touch-friendly em dispositivos móveis
  - Layout otimizado para desktop, tablet e mobile

### 🚀 PWA (Progressive Web App)

- **Instalável**
  - Funciona como app nativo
  - Ícone na tela inicial
  - Experiência standalone

- **Offline-First**
  - Funciona 100% offline
  - Service Worker avançado
  - Cache inteligente
  - Sincronização automática

### 🔍 Busca & Filtros

- **Busca Global**
  - Pesquisa em títulos e descrições
  - Resultados em tempo real
  - Destacar correspondências

- **Filtros Avançados**
  - Por prioridade
  - Por categoria
  - Por status
  - Por data

- **Ordenação**
  - Por prioridade
  - Por data
  - Por título
  - Por categoria

### 📤 Import/Export

- **Backup & Restauração**
  - Exportar tarefas em JSON
  - Importar de backup
  - Compatibilidade entre dispositivos

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/rtheuz/AGENDADOR-DE-TAREFAS.git
cd AGENDADOR-DE-TAREFAS
```

### 2. Servidor Local

#### Opção 1: Python
```bash
python -m http.server 8000
```

#### Opção 2: Node.js
```bash
npx http-server -p 8000
```

#### Opção 3: PHP
```bash
php -S localhost:8000
```

### 3. Acesse no Navegador

```
http://localhost:8000
```

## 📱 Instalar como PWA

### Desktop (Chrome/Edge)
1. Clique no ícone de instalação na barra de endereços
2. Ou: Menu → "Instalar TaskScheduler Pro"

### Android
1. Abra no Chrome
2. Menu (⋮) → "Instalar aplicativo"
3. Confirme a instalação

### iOS/Safari
1. Toque em "Compartilhar" (📤)
2. "Adicionar à Tela Inicial"
3.  Confirme

## 🎯 Como Usar

### Criar Tarefa Rápida
1. Clique no botão **+** (canto inferior direito)
2. Digite o título
3. Selecione uma data rápida (Hoje, Amanhã, Próx.  Semana)
4. Clique em "Criar Tarefa"

### Criar Tarefa Completa
1. Clique no botão **+**
2. Preencha título e descrição
3. Clique em "Opções Avançadas"
4. Configure:
   - Prioridade
   - Categoria
   - Lembrete
5. Salve a tarefa

### Navegar por Visualizações
- **Barra Lateral**: Clique nas opções do menu
  - Hoje, Semana, Próximas, Todas, Concluídas
  - Categorias específicas

### Buscar Tarefas
- Digite no campo de busca no topo
- Resultados aparecem em tempo real

### Filtrar & Ordenar
- Use os dropdowns na toolbar
- Filtro por prioridade
- Ordenação personalizada

### Ativar Notificações
1. Clique no botão de menu (mobile) ou "Ações Rápidas"
2. "Ativar Notificações"
3. Permita no navegador

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl/Cmd + N` | Nova tarefa |
| `Ctrl/Cmd + F` | Focar busca |
| `Esc` | Fechar modais |

## 🛠️ Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Design system completo
- **JavaScript ES6+** - Lógica avançada
- **Service Worker** - PWA e offline

### APIs Utilizadas
- Web Notifications API
- Service Worker API
- Local Storage API
- Web App Manifest
- Cache API

### Padrões de Design
- Design System profissional
- Mobile-First responsive
- Progressive Enhancement
- Offline-First architecture
- Component-based structure

## 📂 Estrutura de Arquivos

```
AGENDADOR-DE-TAREFAS/
│
├── index.html              # Página principal
├── manifest.json           # Configuração PWA
├── service-worker.js       # Service Worker
│
├── css/
│   └── style.css          # Design system completo
│
├── js/
│   ├── app.js             # Lógica principal
│   └── notifications.js   # Sistema de notificações
│
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128. png
│   ├── icon-144x144.png
│   ├── icon-152x152. png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
│
└── README.md              # Documentação
```

## 🎨 Personalização

### Cores do Tema
Edite as variáveis CSS em `css/style.css`:

```css
:root {
    --primary-600: #4f46e5;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
}
```

### Adicionar Novas Categorias
No arquivo `js/app.js`, procure por `categoryIcons`:

```javascript
const categoryIcons = {
    work: '💼',
    personal: '👤',
    // Adicione aqui
    fitness: '🏋️'
};
```

## 🔒 Privacidade & Segurança

- ✅ Todos os dados armazenados localmente
- ✅ Nenhuma transmissão para servidores externos
- ✅ Sem rastreamento ou analytics
- ✅ Sem cookies de terceiros
- ✅ 100% offline-first
- ✅ Código open-source auditável

## 🐛 Troubleshooting

### Notificações não funcionam
- Verifique permissões do navegador
- Confirme HTTPS ou localhost
- Teste em modo normal (não anônimo)

### App não instala
- Use navegador compatível
- Verifique HTTPS
- Limpe cache do navegador

### Dados não salvam
- Verifique LocalStorage habilitado
- Não use modo anônimo
- Verifique espaço de armazenamento

## 📈 Roadmap

### Versão 3.1
- [ ] Subtarefas e checklists
- [ ] Tags personalizadas
- [ ] Anexos de arquivos
- [ ] Modo Pomodoro

### Versão 3.2
- [ ] Sincronização em nuvem (opcional)
- [ ] Compartilhamento de tarefas
- [ ] Integração com Google Calendar
- [ ] Widgets para Android

### Versão 4.0
- [ ] Colaboração em tempo real
- [ ] Assistente com IA
- [ ] Comandos de voz
- [ ] Integração com Zapier

## 🤝 Contribuindo

Contribuições são bem-vindas! 

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. 

## 👨‍💻 Autor

**rtheuz**
- GitHub: [@rtheuz](https://github.com/rtheuz)
- Repositório: [AGENDADOR-DE-TAREFAS](https://github.com/rtheuz/AGENDADOR-DE-TAREFAS)

## 🙏 Agradecimentos

- Design inspirado em ferramentas profissionais de produtividade
- Ícones: Emojis nativos do sistema
- Comunidade open-source

---

**⭐ Se você gostou deste projeto, considere dar uma estrela no GitHub! **

**Made with ❤️ and ☕ by rtheuz**

**#productivity #taskmanagement #pwa #javascript #opensource**