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
      className="h-6 w-[3.15rem] content-center rounded-md bg-[#1e1e1e]/90 text-center text-xs text-[#d2d2d2] outline-none focus:ring focus:ring-[#1e1e1e] md:h-8 md:w-16 md:text-sm lg:h-10 lg:w-20 lg:rounded-lg lg:text-base xl:h-12 xl:w-24 xl:text-lg"
    >
      {children}
    </NavLink>
  );
}

export default NavBtn;
