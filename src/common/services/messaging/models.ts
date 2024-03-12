export const requestBodyMaxSize = 1024 * 1024 * 50;

export interface Provider {
  id: number;
  accountId: number;
  type: ProviderType;
  name: string;
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
  config: IProviderConfig | null;
  state: IProviderState | null;
}


export enum ProviderType {
  Email = 'email',
  Whatsapp = 'whatsapp',
  SMS = 'sms'
}

export enum ProviderStatus {
  Uninitialized = 'uninitialized',
  Initializing = 'initializing',
  Ready = 'ready',
  Error = 'error',
  AuthQRCode = 'auth-qrcode'
}

export interface IProviderConfig { }

export interface IProviderState { }

export interface ProviderWithStatus {
  id: number;
  name: string;
  type: string;
  status: ProviderStatus;
  message?: string;
  qrCodeContent?: string;
}