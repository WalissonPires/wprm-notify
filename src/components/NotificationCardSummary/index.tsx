import { CheckIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";


export function NotificationCardSummary() {

  return (
    <div className="flex flex-row justify-start flex-wrap px-4 py-6 bg-white border m-4">
      <span className="mr-4"><ClockIcon className="h-5 w-5 inline-block text-yellow-500" /> Agendada para envio</span>
      <span className="mr-4"><CheckIcon className="h-5 w-5 inline-block text-green-500" /> Enviada</span>
      <span><XMarkIcon className="h-5 w-5 inline-block text-red-500" /> Envio cancelado</span>
    </div>
  );
}