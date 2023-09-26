## Wprm Notify

Aplicativo web para envio de notificações para seus contatos

## Desenvolvimento

Executar servidor de desenvolvimento

```bash
npm run dev
```

## Database

account(id, name, email, password)
Groups(id, name, color)

Contacts(id, name, phone, email, obs)
ContactMetadata(contactId, name, value)
ContactGroups(contactId, groupId)

TemplateMessages(id, name, content, params(name))

Triggers(id, type(yearly, monthly, daily), month, day, contactId, templateMessageId, paramsValue(name, value))

Notifications(id, scheduledAt, sendedAt, templateMessageId, content)