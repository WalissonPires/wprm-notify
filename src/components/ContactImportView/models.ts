
export interface ContactImportModel {
  name: string;
  phone?: string[];
  email?: string[];
}

export interface ContactImportModel2 extends ContactImportModel {
  id: number;
  checked: boolean;
  errorMessage?: string;
  imported: boolean;
  visible: boolean;
}