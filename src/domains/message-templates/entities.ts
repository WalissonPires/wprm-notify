

export class MessageTemplate {

  private _fields: MessageTemplateProps;

  get id() { return this._fields.id; }
  get name() { return this._fields.name; }
  get content() { return this._fields.content; }
  get params() { return this._fields.params; }
  get notifyDaysBefore() { return this._fields.notifyDaysBefore; }

  constructor(props: MessageTemplateProps) {

    this._fields = { ...props };
  }

  public format(paramsValue: MessageTempplateParamWithValue[]): string {

    let content = this._fields.content;

    for(const param of this._fields.params) {

      const value = paramsValue.find(p => p.name === param.name)?.value ?? '';
      const key = `{{${param.name}}}`;
      content = content.replaceAll(key, value);
    }

    return content;
  }

  public fillParamsFromContent(): void {

    if (!this._fields.content) {
      return;
    }

    let names = Array.from(this._fields.content.matchAll(/{{([a-zA-Z\d_]+)}}/g)).map(match => match[1]);
    names = Array.from(new Set(names));

    this._fields.params = this._fields.params.concat(names.map(name => ({
      name: name,
      type: MessageTemplateParamType.Text,
      value: null
    })));
  }
}

interface MessageTemplateProps {
  id: string;
  name: string;
  content: string;
  notifyDaysBefore: number | null;
  params: MessageTemplateParam[];
}

export interface MessageTemplateParam {
  name: string;
  type: MessageTemplateParamType;
  value: string | null;
}

export enum MessageTemplateParamType {
  Text = 'Text',
  File = 'File'
}

export interface MessageTempplateParamWithValue {
  name: string;
  value: string;
}


export interface MessageTemplate1 {
  id: string;
  name: string;
  content: string;
  notifyDaysBefore: number | null;
  params: MessageTemplateParam[];
}