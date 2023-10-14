import Link from "next/link";

export function AppLayoutTabItem({ label, title, href, replace, active }: AppLayoutTabItemProps) {

  const classes = 'p-4 ' + (active ? 'border-b-4 border-white' : 'opacity-75');

  return (
    <Link href={href} className={classes} title={title} replace={replace} >{label}</Link>
  );
}

export interface AppLayoutTabItemProps {
  href: string;
  replace?: boolean;
  title: string;
  label: string;
  active?: boolean;
}