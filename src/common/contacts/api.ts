import { PagedInput, PagedResult } from "../api/base-models";
import { Contact } from "./models";

export class ContactsApi {

  private _data: Contact[];

  constructor() {

    this._data = [{
      id: 'c-001',
      name: 'Illyasviel von Einzbern',
      phone: '33966000011',
      email: 'illya@email.com',
      nextNotification: {
        id: 'n-001',
        description: 'Estreia em nova temporada de Fate',
        triggerAt: '2023-09-20T00:00:00Z'
      },
      groups: [{
        id: 'g-001',
        name: 'Fate',
        color: 'red',
      }]
    }, {
      id: 'c-002',
      name: 'Rin Tohsaka',
      phone: '66922110011',
      email: '',
      groups: [],
      nextNotification: null
    }, {
      id: 'c-003',
      name: 'Matou Sakura',
      phone: '',
      email: 'sakura@mail.com',
      groups: [{
        id: 'g-001',
        color: 'red',
        name: 'Fate'
      }],
      nextNotification: null
    }];
  }

  public getAll(args: PagedInput): Promise<PagedResult<Contact>> {

    return Promise.resolve({
      offset: args.offset,
      limit: args.limit,
      count: this._data.length,
      data: this._data.slice(args.offset, args.offset + args.limit - 1)
    });
  }
}