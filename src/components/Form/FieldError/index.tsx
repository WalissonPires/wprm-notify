
export function FieldError({ error }: FieldErrorProps) {

  if (!error?.message) return null;

  return (<small className="text-red-400">{error.message}</small>);
}

export interface FieldErrorProps {
  error?: {
    message?: string;
  }
}