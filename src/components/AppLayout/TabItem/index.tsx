import Link from "next/link";

export function AppLayoutTabItem({ label, title, href, active }: AppLayoutTabItemProps) {

  const classes = 'p-4 ' + (active ? 'border-b-4 border-white' : 'opacity-75');

  return (
    <Link href={href} className={classes} title={title}>{label}</Link>
  );
}

export interface AppLayoutTabItemProps {
  href: string;
  title: string;
  label: string;
  active?: boolean;
}