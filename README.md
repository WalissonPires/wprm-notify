# 🔔 WPRM Notify

Uma aplicação web para notificações automatizadas via **WhatsApp**. O usuário pode cadastrar **contatos e grupos** e agendar notificações recorrentes (**diárias, mensais ou anuais**). Além disso, permite a criação de templates de mensagens, facilitando o envio sem precisar redigitar os textos para cada contato.

Ideal para **cobranças, mensagens de aniversário, lembretes de eventos e datas comemorativas**.

Este projeto é integrado ao [Send Messaging API](https://github.com/WalissonPires/MessagingApi) para o envio das mensagens.

## 🎥 Demonstração

Assista ao vídeo mostrando o funcionamento do **WPRM Notify**:

[![Wprm Notify Demonstração Vídeo](https://img.youtube.com/vi/sU3n5tJiTQ8/0.jpg)](http://www.youtube.com/watch?v=sU3n5tJiTQ8 "Wprm Notify Demonstração Vídeo")


## 🚀 Tecnologias Utilizadas

- **Next.js** - Framework para aplicações web com React.
- **TypeScript** - Tipagem estática para melhor manutenção do código.
- **PostgreSQL** - Banco de dados relacional para armazenar contatos, grupos e notificações.
- **Docker** - Facilita a execução e implantação do projeto.
- **CI/CD Pipeline** - Deploy automático configurado (VPS com Coolify e VPS sem painel via SSH).
- **Use Cases** - Arquitetura baseada em casos de uso para melhor organização do código.

## 📦 Instalação e Execução

### 🔹 Executando com Node.js

```bash
git clone https://github.com/WalissonPires/wprm-notify.git

cd wprm-notify

# Para carregar env vars para o script de migrações
# Ref.: https://github.com/prisma/prisma/issues/1255
npm install -G dotenv-cli

npm install

cp .env.example .env

# Criar uma nova migração
# npm run db-migrate -- --name name-migration

# Aplicar migrações
npm run db-apply

npm run dev
```

### 🐳 Executando com Docker

```sh
# Criar a imagem Docker
docker build -t wprm-notify:latest .

# Rodar o container
docker run -d -p 3001:3000 \
  -e DATABASE_URL="postgresql://postgres:masterkey@host.docker.internal:5432/wprm_notify?schema=public" \
  -e COOKIE_PRIVATE_KEY="my-cookie-private-key-0123456789" \
  -e SEND_MESSAGE_API_URL="http://host.docker.internal:3000/" \
  --add-host host.docker.internal:host-gateway \
  wprm-notify:latest
```

## 🛠 Uso da Aplicação

### 📌 Cadastro de Contatos e Grupos

Os usuários podem cadastrar contatos manualmente ou importar da agenda do celular. Também é possível criar **grupos** para facilitar o envio de mensagens em massa.

### 📆 Agendamento e Envio de Mensagens

Cada contato pode ter mensagens agendadas para envio **diário, mensal ou anual**. Também é possível enviar mensagens manualmente para grupos de contatos.

### 📑 Uso de Templates

O sistema permite criar **templates de mensagens** reutilizáveis, facilitando o envio sem necessidade de reescrever os textos.

### 📎 Suporte a Arquivos Multimídia

Além de mensagens de texto, o sistema permite o envio de **imagens, vídeos e documentos**.

### 🤖 Chatbot Integrado

O chatbot responde mensagens recebidas automaticamente, podendo ser utilizado para interações personalizadas.

### 📥 Importação contatos

Suporte para importar contatos da agenda do celular. Basta exportar os contatos do app de agenda e importar para na aplicação.

## ✅ Próximas Implementações

- Adicionar pesquisa nos modelos de mensagem (Pesquisa por nome e conteúdo)
- Adicionar pesquisa nas notificações (Pesquisa por nome cliente)
- Adicionar filtros nas notificações (Enviadas/Agendadas/Todas), Por grupo, Por modelo mensagem, Por Data Envio
- Adicionar visualização de contatos por grupo
- Agendar notificações para grupos de contatos