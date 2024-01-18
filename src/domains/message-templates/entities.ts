

export class MessageTemplate {

  private _fields: MessageTemplateProps;

  get id() { return this._fields.id; }
  get name() { return this._fields.name; }
  get content() { return this._fields.content; }
  get params() { return this._fields.params; }

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
      this._fields.params = [];
    }

    let names = Array.from(this._fields.content.matchAll(/{{([a-zA-Z\d_]+)}}/g)).map(match => match[1]);
    names = Array.from(new Set(names));

    this._fields.params = names.map(name => ({
      name: name
    }));
  }
}

interface MessageTemplateProps {
  id: string;
  name: string;
  content: string;
  params: MessageTemplateParam[];
}

export interface MessageTemplateParam {
  name: string;
}

export interface MessageTempplateParamWithValue {
  name: string;
  value: string;
}


export interface MessageTemplate1 {
  id: string;
  name: string;
  content: string;
  params: MessageTemplateParam[];
}