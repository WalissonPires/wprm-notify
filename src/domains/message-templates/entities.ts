

export class MessageTemplate {

  private _fields: MessageTemplateProps;

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
}

interface MessageTemplateProps {
  content: string;
  params: MessageTempplateParam[];
}

interface MessageTempplateParam {
  name: string;
}

interface MessageTempplateParamWithValue {
  name: string;
  value: string;
}


export interface MessageTemplate1 {
  id: string;
  name: string;
  content: string;
  params: MessageTempplateParam[];
}