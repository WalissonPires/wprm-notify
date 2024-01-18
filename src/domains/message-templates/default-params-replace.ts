import { Contact } from "../contacts/entities";
import { DefaultParamsKey, DefaultParamsUtils } from "./default-params";
import { MessageTemplateParam, MessageTempplateParamWithValue } from "./entities";


export class DefaultParamsReplace {

  public replace(args: DefaultParamsReplaceArgs): MessageTempplateParamWithValue[] {

    const result: MessageTempplateParamWithValue[] = [];
    const utils = new DefaultParamsUtils();
    const contactNameParamNames = utils.getParamsNameFromKey(DefaultParamsKey.ContactName);

    for(const param of args.params) {

      if (contactNameParamNames.includes(param.name) && args.contact) {

        result.push({
          name: param.name,
          value: args.contact.name
        });
      }
    }

    return result;
  }
}

export interface DefaultParamsReplaceArgs {
  params: MessageTemplateParam[];
  contact: Pick<Contact, 'name'> | null;
}