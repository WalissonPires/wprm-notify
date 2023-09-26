import { Contact } from "@/domains/contacts/entities";
import ContactCard from "../ContactCard";

export default function ContactsView({ contacts }: ContactsViewProps) {

  return (
    <div className="container mx-auto">
      <div className="bg-white border m-4">
        <ul className="divide-y">
          {contacts.map(contact =>
            <li key={contact.id}>
              <ContactCard contact={contact} />
            </li>)}
          {contacts.length == 0 && <p className="text-center text-slate-400 p-4">Nenhum contato encontrado</p>}
        </ul>
      </div>
    </div>
  );
}

export interface ContactsViewProps {
  contacts: Contact[];
}