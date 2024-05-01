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

export interface ChatNode {
  id: string;
  label: string;
  patternType: ChatNodePatternType;
  pattern: string;
  output: ChatNodeOutput[];
  invalidOutput?: ChatNodeOutput[];
  childs: ChatNode[];
  delayChildren?: number; // Delay antes de selecionar o próximo estado. CasoUso: O bot pede para o cliente digitar algo. Só que o cliente enviar em varias mensagens. Para exibir que o bot responda na primeira mensagem esperar algum tempo
  action?: {
      type: ChatNodeAction;
  };
  delay?: number; // seconds
}

export interface ChatNodeOutput {
  type: 'text' | 'media-link';
  content: string;
}

export enum ChatNodeAction {
  GoToPrevious = 1
}

export enum ChatNodePatternType {
  StartsWith = 1,
  EndsWith = 2,
  Contains = 3,
  Exact = 4,
  Regex = 5
};

export const AnyText = '.*';