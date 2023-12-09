import { ProviderStatus } from "@/common/services/messaging/models";

export interface ProvidersState {
  whatsapp: ProviderState;
}

export interface ProviderState {
  id: number;
  status: ProviderStateStatus;
  errorMessage?: string;
  qrCodeContent?: string;
}

export enum ProviderStateStatus {
  None = 0,
  NotConfigured = 1,
  Uninitialized = 2,
  Initializing = 3,
  WaitQrCodeRead = 4,
  Ready = 5,
  Error = 6
}

export function mapStatus(providerStatus: ProviderStatus): ProviderStateStatus {

  const map: Record<ProviderStatus, ProviderStateStatus> = {
    [ProviderStatus.Uninitialized]: ProviderStateStatus.Uninitialized,
    [ProviderStatus.Initializing]: ProviderStateStatus.Initializing,
    [ProviderStatus.AuthQRCode]: ProviderStateStatus.WaitQrCodeRead,
    [ProviderStatus.Ready]: ProviderStateStatus.Ready,
    [ProviderStatus.Error]: ProviderStateStatus.Error
  };

  return map[providerStatus];
}
