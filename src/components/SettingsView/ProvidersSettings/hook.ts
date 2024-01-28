import { useState, useEffect } from "react";
import { ProviderType } from "@/common/services/messaging/models";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { ProvidersState, ProviderStateStatus, ProviderState, mapStatus } from "./types";
import { MessageProvidersApi } from "@/domains/message-providers/client-api";

export function useProvidersSettings() {

  const [providers, setProviders] = useState<ProvidersState>({
    whatsapp: {
      id: 0,
      status: ProviderStateStatus.None
    }
  });

  const handleWhatsappProviderCreated = (provider: ProviderState) => {

    setProviders(state => ({
      ...state,
      whatsapp: provider
    }));
  };

  useEffect(() => {

    const execute = async () => {

      try {
        const api = new MessageProvidersApi();
        const providersStatus = await api.getProvidersStatus();

        const whatsappProvider = providersStatus?.find(x => x.type === ProviderType.Whatsapp);

        if (whatsappProvider) {

          setProviders(state => ({
            ...state,
            whatsapp: {
              id: whatsappProvider.id,
              status: mapStatus(whatsappProvider.status),
              qrCodeContent: whatsappProvider.qrCodeContent
            }
          }))
        }
        else {

          setProviders(state => ({
            ...state,
            whatsapp: {
              id: 0,
              status: ProviderStateStatus.NotConfigured
            }
          }))
        }
      }
      catch (error) {

        AppToast.error(AppError.parse(error).message);
      }
    };

    execute();

  }, []);

  useEffect(() => {

    if (!haProvidersPendents(providers))
      return;

    const intervalId = setInterval(async () => {

      try {
        const api = new MessageProvidersApi();
        const providersStatus = await api.getProvidersStatus();

        if (!providersStatus)
          return;

        for (const provider of providersStatus) {

          if (provider.type === ProviderType.Whatsapp) {

            if (provider.id !== providers.whatsapp.id)
              continue;

            const hasChanges = mapStatus(provider.status) !== providers.whatsapp.status || provider.qrCodeContent !== providers.whatsapp.qrCodeContent;
            if (!hasChanges)
              continue;

            setProviders(state => ({
              ...state,
              whatsapp: {
                ...state.whatsapp,
                status: mapStatus(provider.status),
                errorMessage: provider.message,
                qrCodeContent: provider.qrCodeContent
              }
            }));
          }
        }
      }
      catch (error) {
        AppToast.error(AppError.parse(error).message);
      }

    }, 2000);

    return () => clearInterval(intervalId);

  }, [providers]);

  return {
    providers,
    handleWhatsappProviderCreated
  }
}

function haProvidersPendents(providers: ProvidersState) {

  return providers.whatsapp.status === ProviderStateStatus.Initializing || providers.whatsapp.status === ProviderStateStatus.WaitQrCodeRead;
}