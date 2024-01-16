import { useRouter } from "next/navigation";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Contact } from "@/domains/contacts/entities";
import { AppError } from "@/common/error";
import { AppRoutes } from "@/common/routes";
import ContactCard from "../ContactCard";
import { Button } from "../Form";

export default function ContactsView({ contacts, isLoading, error, hasMore, triggerLoadMore, onDeleteContact }: ContactsViewProps) {

  const router = useRouter();
  const isEmpty = contacts.length == 0 && !isLoading && !error;
  const isFirstLoading = isLoading && contacts.length === 0;

  const getHandleContactSelected = (contactId: string) => () => router.push(AppRoutes.viewContact(contactId));

  return (
    <div className="container mx-auto">
      <div className="bg-white border m-4">
        <ul className="divide-y">
          {contacts.map(contact =>
            <li key={contact.id} onClick={getHandleContactSelected(contact.id)}>
              <ContactCard contact={contact} onDeleteContact={() => onDeleteContact(contact)} />
            </li>)}
          {isEmpty && <p className="text-center text-slate-400 p-4">Nenhum contato encontrado</p>}
          {isFirstLoading && <ContactCard.Skeleton />}
          {error && <p className="text-center text-red-400 p-4">{error.message}</p>}
        </ul>
      </div>
      {hasMore &&
        <div className="text-center mb-4">
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
  onDeleteContact: (contact: Contact) => void;
}