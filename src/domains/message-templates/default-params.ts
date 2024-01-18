import { AppError } from "@/common/error";

export enum DefaultParamsKey {
  ContactName = 'ContactName',
  ContactPhone = 'ContactPhone'
}

type DefaultParamsType = Record<DefaultParamsKey, string>;

export const DefaultParamsUs: DefaultParamsType = {
  ContactName: 'ContactName',
  ContactPhone: 'ContactPhone',
};

export const DefaultParamsPtBr: DefaultParamsType = {
  ContactName: 'ContatoNome',
  ContactPhone: 'ContatoTelefone',
}

export type SupportedLanguages = 'pt-BR' | 'en-US';

export class DefaultParamsUtils {

  public getParamsNameFromKey(key: DefaultParamsKey): string[] {

    const keys = [
      DefaultParamsPtBr,
      DefaultParamsUs
    ];

    return keys.map(obj => obj[key]);
  }

  public getAllParamsFromLanguage(language: SupportedLanguages): DefaultParamsType {

    const langMap: Record<SupportedLanguages, DefaultParamsType> = {
      'pt-BR': DefaultParamsPtBr,
      'en-US': DefaultParamsUs
    };

    const params = langMap[language];

    if (!params)
      throw new AppError('Language not supported: ' + language);

    return params;
  }

  public getAllParamsDefaultLanguage() {

    return this.getAllParamsFromLanguage('pt-BR');
  }
}