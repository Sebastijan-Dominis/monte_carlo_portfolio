interface SettingsExceptionProps {
  purpose: string;
}

function SettingsException({ purpose }: SettingsExceptionProps) {
  return (
    <p className="mt-4 text-center text-lg text-[#d2d2d2] md:mt-8 md:text-xl lg:mt-12 lg:text-2xl xl:mt-16 xl:text-3xl">
      {purpose === "loggedOut" && "You are not logged in."}
      {purpose === "noSettings" && "No settings found."}
    </p>
  );
}

export default SettingsException;
