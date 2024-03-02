import { useState, useRef, useMemo, ChangeEvent } from "react";
import { AppError } from "@/common/error";
import { sortAsc } from "@/common/primitives/array/sort-utils";
import { AppToast } from "@/common/ui/toast";
import { ContactsApi } from "@/domains/contacts/client-api";
import { readFileAsText } from "@/common/primitives/file/file-reader";
import { useLoading } from "../../AppLayout/Loading/hooks";
import { useGroups } from "../../Groups/hooks";
import { parseFileVcf } from "../vcard-parser";
import { ContactImportModel2 } from "../models";

export function useContactImportView() {

  const [contacts, setContacts] = useState<ContactImportModel2[]>([]);
  const [ queryTerm, setQueryTerm ] = useState('');
  const [ allSelected, setAllSelected ] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const groupSelectRef = useRef<HTMLSelectElement | null>(null);
  const { groups, isLoading: isLoadingGroups } = useGroups();
  const { isLoading, setLoading } = useLoading();

  const contactsSelected = useMemo(() => contacts.filter(x => x.checked), [ contacts ]);

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];
    if (!file) return;

    const buffer = await readFileAsText(file);
    const contacts = parseFileVcf(buffer);

    setContacts(contacts.sort((a, b) => sortAsc(a.name, b.name)).map((c, index) => ({
      ...c,
      id: index,
      checked: true,
      imported: false,
      visible: true,
      phone: c.phone?.map(phone => phone.length >= 12 && phone.startsWith('55') ? phone.substring(2) : phone)
    })));

    if (contacts.length === 0)
      AppToast.info('Nenhum contato encontrado');
  };

  const handleChangeSelection = (contact: ContactImportModel2) => (event: ChangeEvent) => {

    const contactsUpdated = contacts.map(c  => c.id === contact.id ? { ...contact, checked: !contact.checked, errorMessage: undefined } : c);
    setContacts(contactsUpdated);
  };

  const handleChangeSelectionAll = () => {

    const allSelectedInveted = !allSelected;
    setAllSelected(allSelectedInveted);
    setContacts(contacts.map(c => ({...c, checked: allSelectedInveted })));
  };

  const handleCancelImport = () => {

    setContacts([]);
  };

  const handleRemoveImported = () => {

    const contactsUpdated = contacts.filter(x => !x.imported);
    setContacts(contactsUpdated);

    if (contacts.length !== contactsUpdated.length)
      AppToast.success('Contatos já importados removido da lista');
  }

  const handleImport = async () => {

    if (contactsSelected.length === 0) {
      AppToast.warning('Selecione um ou mais contatos');
      return;
    }

    setLoading(true);

    try {

      const defaultGroupId = groupSelectRef.current?.value;
      if (!defaultGroupId) {

        AppToast.warning('Selecione um grupo padrão para os contatos');
        return;
      }

      const api = new ContactsApi();

      AppToast.info('Importação iniciada. Aguarde...');

      const result = await api.import({
        contacts: contactsSelected.map(c => ({
          name: c.name,
          phone: c.phone?.[0],
          email: c.email?.[0],
          groupsId: [ defaultGroupId ]
        }))
      });


      let contactSuccessCount = 0;
      let contactsUpdated = [ ...contacts ];

      for(let i = 0; i < result.contacts.length; i++) {

        const contactResult = result.contacts[i];
        const contact = contactsSelected.at(i)!;
        const index = contacts.findIndex(c => c.id === contact.id);

        if (contactResult.success) {
          contactsUpdated.splice(index, 1, { ...contact, checked: false, imported: true, errorMessage: undefined });
          contactSuccessCount++;
          continue;
        }

        const contactExists = contactResult.errors?.some(message => message.includes('Já existe um contato')) === true;

        contactsUpdated.splice(index, 1, { ...contact, imported: contactExists, errorMessage: contactResult.errors?.join('. ') });
      }

      setContacts(contactsUpdated);

      if (contactSuccessCount === contactsSelected.length)
        AppToast.success('Contactos importados');
      else
        AppToast.error('Um ou mais contatos não foram importados. Verifique as validações');
    }
    catch(error) {

      AppToast.error(AppError.parse(error).getExtendedMessage());
    }
    finally {
      setLoading(false);
    }
  };

  const handleShowFileDialog = () => {

    inputRef.current?.click();
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {

    const term = event.target.value.toLowerCase();

    const contactsUpdated = contacts.map(contact =>
    {
      return {
        ...contact,
        visible: contact.name.toLowerCase().includes(term)
      }
    });

    setQueryTerm(event.target.value);
    setContacts(contactsUpdated);
  };

  return {
    isLoading,
    isLoadingGroups,
    groups,
    contacts,
    allSelected,
    contactsSelected,
    inputRef,
    groupSelectRef,
    queryTerm,
    handleFileSelected,
    handleChangeSelection,
    handleChangeSelectionAll,
    handleCancelImport,
    handleImport,
    handleRemoveImported,
    handleShowFileDialog,
    handleQueryChange
  }
}