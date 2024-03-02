import vCard from "vcf";
import { ContactImportModel } from "./models";

export function parseFileVcf(vcfRaw: string): ContactImportModel[] {

  const cards = vCard.parse(vcfRaw);
  const result: ContactImportModel[] = [];

  for(const card of cards) {

    const { n, fn, tel, cell, pref, email } = card.data;

    const ignore = [ n, fn ].some(x => ((Array.isArray(x) ? x[0] : x) as any)?.encoding === 'QUOTED-PRINTABLE');
    if (ignore) continue;

    const meta = {
      n: (Array.isArray(n) ? n.map(t => t.valueOf()).join(' ') : n?.valueOf()),
      fn: Array.isArray(fn) ? fn.map(t => t.valueOf()).join(' ') : fn?.valueOf(),
      tel: Array.isArray(tel) ? tel.map(t => t.valueOf()) : tel?.valueOf(),
      cell: Array.isArray(cell) ? cell.map(t => t.valueOf()) : cell?.valueOf(),
      pref: Array.isArray(pref) ? pref.map(t => t.valueOf()) : pref?.valueOf(),
      email: Array.isArray(email) ? email.map(t => t.valueOf()) : email?.valueOf(),
    };

    const phone = meta.cell || meta.tel || meta.pref;

    const contact: ContactImportModel = {
      name: meta.fn || meta.n,
      phone: phone ? (Array.isArray(phone) ? phone : [ phone ]) : undefined,
      email: meta.email ? (Array.isArray(meta.email) ? meta.email : [ meta.email ]) : undefined,
    };

    contact.phone = contact.phone?.map(phone => {

      phone = phone.replace(/\D/g, '');

      if (phone.length! <= 9) {
        phone = '**' + phone;
        console.log(phone);
      }

      return phone;
    });

    if (!contact.name || contact.name.trim().length === 0) {
      continue;
    }

    result.push(contact);
  }

  return result;
}