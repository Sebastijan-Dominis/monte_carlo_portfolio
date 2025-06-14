import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";

type NavBtnProps = {
  link: string;
  children: ReactNode;
};

function NavBtn({ link, children }: NavBtnProps) {
  return (
    <NavLink
      to={link}
      className="h-6 w-12 content-center rounded-md bg-[#1e1e1e]/90 text-center text-xs text-[#d2d2d2]"
    >
      {children}
    </NavLink>
  );
}

export default NavBtn;
