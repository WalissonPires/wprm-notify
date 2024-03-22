import { useState } from "react";
import { AppError } from "@/common/error";
import { AppToast } from "@/common/ui/toast";
import { delay } from "@/common/primitives/promise/delay";
import { tryExecute, isExecuteError } from "@/common/primitives/promise/try-promise";
import { MessageProvidersApi } from "@/domains/message-providers/client-api";
import { ProviderState, mapStatus } from "../types";


export function useWhatsappSettings(args: { provider: ProviderState, onProviderCreated: (provider: ProviderState) => void; }) {

  const [ isLoading, setIsLoading ] = useState(false);

  const handleConfigureWhatsapp = async () => {

    setIsLoading(true);

    try {
      const api = new MessageProvidersApi();

      const provider = await api.createWhatsappProvider();

      if (!provider) {
        AppToast.error('No response from server');
        return;
      }

      const initResult = await tryExecute(api.initProvider({ id: provider.id }));

      if (isExecuteError(initResult)) {

        args.onProviderCreated({
          id: provider.id,
          status: mapStatus(provider.status)
        });

        return;
      }

      await delay(2000);

      const providersStatus = await api.getProvidersStatus({ id: provider.id });
      const providerStatus = providersStatus?.at(0);

      if (providerStatus) {

        args.onProviderCreated({
          id: providerStatus.id,
          status: mapStatus(providerStatus.status),
          errorMessage: providerStatus.message,
          qrCodeContent: providerStatus.qrCodeContent
        });
      }
    }
    catch (error) {

      AppToast.error(AppError.parse(error).message);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleConnectToWhatsapp = async () => {

    setIsLoading(true);

    try {
      const api = new MessageProvidersApi();

      api.initProvider({ id: args.provider.id });

      await delay(2000);

      const providersStatus = await api.getProvidersStatus({ id: args.provider.id });
      const providerStatus = providersStatus?.at(0);

      if (providerStatus) {

        args.onProviderCreated({
          id: providerStatus.id,
          status: mapStatus(providerStatus.status),
          errorMessage: providerStatus.message,
          qrCodeContent: providerStatus.qrCodeContent
        });
      }
    }
    catch (error) {

      AppToast.error(AppError.parse(error).message);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectFromWhatsapp = async () => {

    setIsLoading(true);

    try {
      const api = new MessageProvidersApi();

      api.finalizeProvider({ id: args.provider.id });

      await delay(2000);

      const providersStatus = await api.getProvidersStatus({ id: args.provider.id });
      const providerStatus = providersStatus?.at(0);

      if (providerStatus) {

        args.onProviderCreated({
          id: providerStatus.id,
          status: mapStatus(providerStatus.status),
          errorMessage: providerStatus.message,
          qrCodeContent: providerStatus.qrCodeContent
        });
      }
    }
    catch (error) {

      AppToast.error(AppError.parse(error).message);
    }
    finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleConfigureWhatsapp,
    handleConnectToWhatsapp,
    handleDisconnectFromWhatsapp
  }
}