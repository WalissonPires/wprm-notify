'use client'

import { QRCodeSVG } from 'qrcode.react';
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/Form";
import { ProviderState, ProviderStateStatus } from "../types";
import { useWhatsappSettings } from "./hook";


export function WhatsappSettings(props: WhatsappSettingsProps) {

  const { isLoading, handleConfigureWhatsapp, handleConnectToWhatsapp } = useWhatsappSettings({
    provider: props.data,
    onProviderCreated: props.onProviderCreated
  });

  const { status } = props.data;

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">Whatsapp integração</h2>
        </div>
        <div>
          {status === ProviderStateStatus.None && <Skeleton height={40} />}
          {status === ProviderStateStatus.NotConfigured && <WANotConfigure isLoading={isLoading} onConfigure={handleConfigureWhatsapp} />}
          {status === ProviderStateStatus.Uninitialized && <WAUninitialized isLoading={isLoading} onConnect={handleConnectToWhatsapp} />}
          {status === ProviderStateStatus.Initializing && <WAUInitializing />}
          {status === ProviderStateStatus.WaitQrCodeRead && <WAQrCodeRead qrCodeContent={props.data.qrCodeContent ?? ''} />}
          {status === ProviderStateStatus.Ready && <WAReady />}
          {status === ProviderStateStatus.Error && <WAError errorMessage={props.data.errorMessage ?? ''} />}
        </div>
      </div>
    </div>
  );
}

export interface WhatsappSettingsProps {
  data: ProviderState;
  onProviderCreated: (provider: ProviderState) => void;
}

function WANotConfigure(props: { isLoading: boolean, onConfigure: () => void }) {

  return (
    <div>
      <p className="mb-3">Configure ao seu whatsapp para enviar mensagens</p>
      <Button onClick={props.onConfigure} disabled={props.isLoading}>{props.isLoading ? 'Configurando...' : 'Configurar agora'}</Button>
    </div>
  );
}


function WAUninitialized(props: { isLoading: boolean, onConnect: () => void }) {

  return (
    <div>
      <div className="h-2 bg-yellow-400 text-white"></div>
      <p className="mb-3">Você está desconectado do whatsapp.</p>
      <Button onClick={props.onConnect} disabled={props.isLoading}>{props.isLoading ? 'Conectando...' : 'Conectar agora'}</Button>
    </div>
  );
}


function WAUInitializing() {

  return (
    <div>
      <div className="h-2 bg-blue-400 text-white"></div>
      <p className="mb-3">Aguarde que estamos tentando conectar ao whatsapp.</p>
    </div>
  );
}

function WAQrCodeRead(props: { qrCodeContent: string }) {

  return (
    <div>
      <p className="mb-3">Leia o QR CODE usando seu Whatsapp.</p>
      <div className="flex items-center justify-center">
        <QRCodeSVG value={props.qrCodeContent} />
      </div>
    </div>
  );
}

function WAReady() {

  return (
    <div>
      <div className="h-2 bg-green-400 text-white"></div>
      <p className="mb-3">Você está conectado ao whatsapp.</p>
    </div>
  );
}


function WAError(props: { errorMessage: string }) {

  return (
    <div>
      <div className="h-2 bg-red-400 text-white"></div>
      <p className="mb-3">Falha ao conectar ao whatsapp.</p>
      <p className="text-red-400">{props.errorMessage}</p>
    </div>
  );
}
