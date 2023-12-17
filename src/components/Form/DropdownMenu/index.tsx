import { MouseEvent, PropsWithChildren } from "react";


export function DropdownMenu({ defaultAction, toggle, visible, children }: DropdownMenuProps) {

  return (
    <div className="inline-flex bg-white border rounded-md">
      {defaultAction}
      <div className="relative">
        {toggle}
        <div className="absolute right-0 z-10 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg" hidden={!visible}>
          <div className="p-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export interface DropdownMenuProps extends PropsWithChildren {
  defaultAction?: React.ReactNode;
  toggle: React.ReactNode;
  visible: boolean;
}


export function DropdownMenuToggleDefaultAction({ children }: PropsWithChildren) {

  return (
    <a href="#" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-l-md">
      {children}
    </a>
  );
}


export function DropdownMenuToggle({ children, onClick }: DropdownMenuToggleProps) {

  return (
    <button onClick={onClick} type="button" className="inline-flex items-center justify-center h-full px-2 text-gray-600 border-l border-gray-100 hover:text-gray-700 rounded-r-md hover:bg-gray-50">
      {children}
    </button>
  );
}

export interface DropdownMenuToggleProps extends PropsWithChildren {
  onClick: (event: MouseEvent) => void;
}


export function DropdownMenuItem({ children, onClick }: DropdownMenuItemProps) {

  return (
    <div onClick={onClick} className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700" >
      {children}
    </div>
  );
}

export interface DropdownMenuItemProps extends PropsWithChildren {
  onClick?: (event: MouseEvent) => void;
}