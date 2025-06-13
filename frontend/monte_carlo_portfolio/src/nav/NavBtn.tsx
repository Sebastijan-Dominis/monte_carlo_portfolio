import { type ReactNode } from "react";

type NavBtnProps = {
  onClick: () => void;
  children: ReactNode;
};

function NavBtn({ onClick, children }: NavBtnProps) {
  return (
    <button
      onClick={onClick}
      className="h-6 w-12 rounded-md bg-[#1e1e1e]/80 text-sm text-slate-200"
    >
      {children}
    </button>
  );
}

export default NavBtn;
