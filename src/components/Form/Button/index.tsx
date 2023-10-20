'use client'

export function Button({ className, children, outline, variant, ...props }: ButtonProps) {

  const variants: Record<ButtonVariants, () => React.ReactNode> = {
    'primary': () => <button type="button" className={`bg-green-500 text-white text-sm py-2 px-4 rounded-sm hover:bg-green-600 focus:bg-green-700 disabled:bg-green-300 disabled:hover:bg-green-300 ${className}`} {...props}>{children}</button>,

    'secondary': () => <button type="button" className={`bg-slate-500 text-white text-sm py-2 px-4 rounded-sm hover:bg-slate-600 focus:bg-slate-700 disabled:bg-slate-300 disabled:hover:bg-slate-300 ${className}`} {...props}>{children}</button>,

    'textOnly': () => <button type="button" className={`bg-transparent text-current text-sm py-2 px-4 rounded-sm disabled:text-slate-400 ${className}`} {...props}>{children}</button>,

    'transparent': () => <button className={`border rounded-sm py-2 px-4 hover:bg-black/5 focus:bg-black/10 text-current ${className}`} {...props}>{children}</button>
  };

  variant ??= 'primary';

  const fn = variants[variant];

  return fn?.();
}

export interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  outline?: boolean;
  variant?: ButtonVariants;
}

type ButtonVariants = 'primary' | 'secondary' | 'textOnly' | 'transparent';