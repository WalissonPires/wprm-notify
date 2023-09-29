import { Contact } from "@/domains/contacts/entities";
import { AppError } from "@/common/error";
import ContactCard from "../ContactCard";
import Button from "../Form/Button";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function ContactsView({ contacts, isLoading, error, hasMore, triggerLoadMore }: ContactsViewProps) {

  const isEmpty = contacts.length == 0 && !isLoading && !error;
  const isFirstLoading = isLoading && contacts.length === 0;

  return (
    <div className="container mx-auto">
      <div className="bg-white border m-4">
        <ul className="divide-y">
          {contacts.map(contact =>
            <li key={contact.id}>
              <ContactCard contact={contact} />
            </li>)}
          {isEmpty && <p className="text-center text-slate-400 p-4">Nenhum contato encontrado</p>}
          {isFirstLoading && <ContactCard.Skeleton />}
          {error && <p className="text-center text-red-400 p-4">{error.message}</p>}
        </ul>
      </div>
      {hasMore &&
        <div className="text-center">
          <Button onClick={triggerLoadMore} disabled={isLoading} variant="textOnly"><ArrowDownTrayIcon className="h-5 w-5 inline-block" /> {isLoading ? 'Carregando...' : 'Carregar dados'}</Button>
        </div>}
    </div>
  );
}

export interface ContactsViewProps {
  contacts: Contact[];
  isLoading: boolean;
  error: AppError | null;
  hasMore: boolean;
  triggerLoadMore: () => void;
}