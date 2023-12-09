'use client'

import { WhatsappSettings } from "./WhatsappSettings";
import { useProvidersSettings } from "./hook";

export function ProvidersSettings() {

  const { providers, handleWhatsappProviderCreated } = useProvidersSettings();

  return (
    <WhatsappSettings data={providers.whatsapp} onProviderCreated={handleWhatsappProviderCreated} />
  );
}
