import type { ReactNode } from "react";

interface SettingsBtnProps {
  onClick: () => void;
  children: ReactNode;
}

function SettingsBtn({ onClick, children }: SettingsBtnProps) {
  return (
    <button
      className="w-14 rounded-lg bg-[#d2d2d2] px-2 py-1 text-sm outline-none focus:ring focus:ring-[#d2d2d2] focus:ring-offset-2 md:w-20 md:px-4 md:py-2 md:text-base lg:w-28 lg:text-lg"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default SettingsBtn;
