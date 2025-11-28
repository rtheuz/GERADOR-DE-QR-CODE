# 📋 Task Scheduler - Agendador de Tarefas Web

Um agendador de tarefas web completo e funcional com interface moderna e intuitiva, desenvolvido com HTML5, CSS3 e JavaScript vanilla.

## ✨ Funcionalidades

### 📝 Gerenciamento de Tarefas
- **Criar tarefas** com título, descrição, data, horário, prioridade e categoria
- **Editar** tarefas existentes
- **Excluir** tarefas com confirmação
- **Marcar como concluída** (dar baixa)
- **Duplicar** tarefas rapidamente

### 🎯 Prioridades
- 🔴 **Alta** - Destaque em vermelho
- 🟡 **Média** - Destaque em amarelo
- 🟢 **Baixa** - Destaque em verde

### 📁 Categorias
- 🔵 **Trabalho**
- 🟣 **Pessoal**
- 🟢 **Estudos**
- 🔴 **Saúde**
- 🟡 **Compras**
- ⚪ **Outros**

### 👀 Visualizações
- **Lista** - Visualização tradicional em lista
- **Cards** - Grid responsivo com cards coloridos

### 🔍 Filtros e Busca
- Filtrar por **status** (Todas, Ativas, Concluídas)
- Filtrar por **prioridade**
- Filtrar por **categoria**
- Filtrar por **data** (Hoje, Esta Semana, Este Mês)
- **Busca** por título ou descrição

### 🔔 Sistema de Notificações
- Notificações do navegador para tarefas que vencem em:
  - 1 hora
  - 30 minutos
  - No momento do vencimento
- Badge contador de tarefas pendentes
- Indicador visual para tarefas atrasadas

### 📊 Dashboard de Estatísticas
- Total de tarefas
- Tarefas concluídas
- Tarefas pendentes
- Tarefas atrasadas
- Taxa de conclusão (%)

### 💾 Persistência de Dados
- Salvamento automático no **LocalStorage**
- **Exportar** tarefas em formato JSON
- **Importar** tarefas de arquivo JSON

### 🎨 Interface
- Design moderno e profissional
- **Modo escuro** (Dark Mode)
- Totalmente **responsiva** (mobile, tablet, desktop)
- Animações suaves
- Ícones intuitivos

## 🚀 Como Usar

### Instalação
1. Clone ou baixe este repositório
2. Navegue até a pasta `task-scheduler`
3. Abra o arquivo `index.html` em qualquer navegador moderno

### Criando uma Tarefa
1. Clique no botão **+** flutuante no canto inferior direito
2. Preencha o título (obrigatório) e outros campos
3. Clique em **Salvar Tarefa**

### Atalhos de Teclado
- `N` - Criar nova tarefa
- `/` - Focar na busca
- `Esc` - Fechar modal

### Exportar/Importar Dados
- Use o botão **Exportar JSON** para fazer backup das tarefas
- Use o botão **Importar JSON** para restaurar tarefas de um backup

## 📁 Estrutura do Projeto

```
task-scheduler/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos completos
├── js/
│   ├── app.js          # Lógica principal
│   ├── storage.js      # Gerenciamento LocalStorage
│   └── notifications.js # Sistema de notificações
└── README.md           # Esta documentação
```

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico com ARIA labels para acessibilidade
- **CSS3**:
  - Flexbox e Grid Layout
  - Variáveis CSS (Custom Properties)
  - Animações e transições
  - Media queries para responsividade
- **JavaScript ES6+**:
  - Classes para organização do código
  - LocalStorage API
  - Notifications API
  - Manipulação de datas
  - Event delegation

## 🎨 Paleta de Cores

### Modo Claro
- Primária: `#6366f1` (Índigo)
- Fundo: `#ffffff` / `#f8fafc`
- Texto: `#1e293b`

### Modo Escuro
- Primária: `#818cf8` (Índigo claro)
- Fundo: `#0f172a` / `#1e293b`
- Texto: `#f8fafc`

## ♿ Acessibilidade

- Labels adequados em todos os formulários
- Contraste de cores WCAG AA
- Navegação por teclado
- ARIA labels e roles apropriados
- Suporte a leitores de tela

## 📱 Responsividade

O aplicativo é totalmente responsivo e funciona em:
- 📱 Smartphones (a partir de 320px)
- 📱 Tablets (a partir de 768px)
- 💻 Desktops (a partir de 1024px)

## 🔒 Privacidade

Todos os dados são armazenados localmente no seu navegador usando LocalStorage. Nenhum dado é enviado para servidores externos.

## 📝 Estrutura de Dados

```javascript
{
  id: "task_timestamp_randomId",
  title: "string",
  description: "string",
  date: "YYYY-MM-DD",
  time: "HH:MM",
  priority: "high" | "medium" | "low",
  category: "work" | "personal" | "study" | "health" | "shopping" | "other",
  completed: boolean,
  createdAt: timestamp,
  completedAt: timestamp | null
}
```

## 🌐 Compatibilidade

Testado e compatível com:
- Google Chrome (últimas versões)
- Mozilla Firefox (últimas versões)
- Microsoft Edge (últimas versões)
- Safari (últimas versões)

## 📄 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 👤 Autor

**rtheuz**

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
