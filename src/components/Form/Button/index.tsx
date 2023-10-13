'use client'

export function Button({ children, outline, variant, ...props }: ButtonProps) {

  if (variant === 'textOnly')
    return <button type="button" className="bg-transparent text-current text-sm py-2 px-4 rounded-sm disabled:text-slate-400" {...props}>{children}</button>;

  if (variant === 'secondary')
    return <button type="button" className="bg-slate-500 text-white text-sm py-2 px-4 rounded-sm hover:bg-slate-600 focus:bg-slate-700 disabled:bg-slate-300 disabled:hover:bg-slate-300" {...props}>{children}</button>;

  return <button type="button" className="bg-green-500 text-white text-sm py-2 px-4 rounded-sm hover:bg-green-600 focus:bg-green-700 disabled:bg-green-300 disabled:hover:bg-green-300" {...props}>{children}</button>;
}

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  outline?: boolean;
  variant?: 'primary' | 'secondary' | 'textOnly';
}