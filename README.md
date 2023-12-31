## Wprm Notify

Aplicativo web para envio de notificações para seus contatos

## Desenvolvimento

Instale as seguintes dependências globais:

```sh
# Para carregar env vars para o script de migrações
# Ref.: https://github.com/prisma/prisma/issues/1255
npm install -G dotenv-cli
```

Crie um arquivo `.env-development.local` na raiz do projeto:

```sh
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
DIRECT_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Aplique as migrações:

```sh
npm run db-apply
```

Executar servidor de desenvolvimento

```bash
npm run dev
```

## Database

Criar migração:

```sh
npm run db-migrate -- --name name-migration
```

account(id, name, email, password)
Groups(id, name, color)

Contacts(id, name, phone, email, obs)
ContactMetadata(contactId, name, value)
ContactGroups(contactId, groupId)

TemplateMessages(id, name, content, params(name))

Triggers(id, type(yearly, monthly, daily), month, day, contactId, templateMessageId, paramsValue(name, value))

Notifications(id, scheduledAt, sendedAt, templateMessageId, content)

## To DO

- [ ] - Alterar Modelo de mensagem
- [ ] - Adicionar pesquisa nos modelos de mensagem (Pesquisa por nome e conteudo)
- [ ] - Adicionar pesquisa nas notificações (Pesquisa por nome cliente)
- [ ] - Adicionar filtros nas notificações (Enviadas/Agendadas/Todas, Por grupo, Por modelo mensagem, Por Data Envio range)
- [x] - Adicionar pesquisa nos contatos (Pesquisa por nome, telefone, email)
- [x] - Adicionar filtros nos contatos (Por grupo)
- [ ] - Adicionar visualização de contatos por grupo
- [ ] - Cadastrar contato
- [ ] - Alterar contato
- [ ] - Excluir contato
- [ ] - Criar tarefa cron para geração das notificações
- [ ] - Criar tarefa cron para envio das notificações
- [ ] - Registrar conta*
- [ ] - Redefinir senha conta*
- [ ] - Logar na aplicação*

>  \* Usar login do google?
