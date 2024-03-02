'use client'

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { MasksUtils } from '@/common/validation/masks';
import { Button, Input, InputMask, Select, maskValue } from '../Form';
import { useContactImportView } from './hooks';
import { ContactImportModel } from './models';
import { ChangeEvent, useState } from 'react';

export function ContactImportView() {

  const  {
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
  } = useContactImportView();


  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">Importe seus contato do celular</h2>
        </div>
        <div>
          {contacts.length === 0 && <>
            <p className="my-3 bg-yellow-100 text-yellow-600 p-3">
              Abra o aplicativo de contatos do seu celular e exporte seus contatos para um arquivo. Em seguida, clique no botão abaixo para abrir o arquivo.
            </p>
            <Button onClick={handleShowFileDialog} variant="transparent" disabled={isLoading}>Abrir arquivo de contatos</Button>
            <input ref={inputRef} type="file" onChange={handleFileSelected} accept='*.vcf' className="hidden" />
          </>}
          {contacts.length > 0 &&
          <>
            <div className="mb-3">
              <label>Selecione um grupo para os contatos</label>
              <Select ref={groupSelectRef}>
                <option value="">{isLoadingGroups ? 'Carregando...' : 'Selecionar...'}</option>
                { groups.map(item => <option value={item.id} key={item.id}>{item.name}</option>) }
              </Select>
            </div>
            <div className='mt-3 flex justify-between'>
              <Button onClick={handleCancelImport} variant="secondary" disabled={isLoading}>Cancelar</Button>
              <Button onClick={handleRemoveImported} variant="secondary" disabled={isLoading}>Limpar importados</Button>
              <Button onClick={handleImport} variant="primary" disabled={isLoading}>Importar</Button>
            </div>
            <p className="my-3 flex justify-between"><span>{contactsSelected.length} de {contacts.length} serão importados.</span></p>
            <ul className="divide-y">
              <li className="text-left my-3 flex">
                <input onChange={handleChangeSelectionAll} type="checkbox" checked={allSelected} className='mx-3 scale-150' />
                <div className="inline-block flex-1">
                  <Input placeholder="Pesquisar" value={queryTerm} onChange={handleQueryChange} />
                </div>
              </li>
              {contacts.filter(x => x.visible).map(contact =>
                <li key={contact.id} className={(contact.imported ? 'bg-green-300' : '') + ' hover:bg-slate-50'}>
                  <div className='flex items-center justify-between'>
                    <input  onChange={handleChangeSelection(contact)} type="checkbox" checked={contact.checked} className='mx-3 scale-150' />
                    <Card contact={contact} />
                  </div>
                  {contact.errorMessage && <p className="text-red-400">{contact.errorMessage}</p>}
                </li> )}
            </ul>
            <div className='mt-3 flex justify-between'>
              <Button onClick={handleCancelImport} variant="secondary" disabled={isLoading}>Cancelar</Button>
              <Button onClick={handleImport} variant="primary" disabled={isLoading}>Importar</Button>
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}

function Card({ contact }: {contact: ContactImportModel}) {

  return (
    <div key={contact.name} className="flex-1 flex flex-row justify-between px-4 py-6">
      <div className="flex-1">
        <span className="text-lg font-semibold text-slate-700 text-ellipsis whitespace-nowrap overflow-hidden block max-w-[50vw]">{contact.name}</span>
        <div className="mt-2">
          {contact.phone &&
            <span className="inline-flex flex-row items-center text-sm text-slate-500 mr-4">
              <PhoneIcon className="h-5 w-5 inline-block text-blue-600 mr-2" />
              {contact.phone.map(phone => <span key={phone}>{maskValue(phone, { mask: MasksUtils.getPhoneMaskFromPlan(phone) })}</span>)}
            </span>}
            {contact.email &&
            <span className="inline-flex flex-row items-center text-sm text-slate-500 mr-4">
              <EnvelopeIcon className="h-5 w-5 inline-block text-amber-600 mr-2" />
              {contact.email.map(email => <span key={email}>{email}</span>)}
            </span>}
        </div>
      </div>
    </div>
  );
}
