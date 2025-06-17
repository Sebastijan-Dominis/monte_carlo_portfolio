import { useAuth } from "../auth/AuthContext";

function Footer() {
  const { isLoggedIn, email } = useAuth();

  return (
    <>
      <footer className="overflow-x-hidden p-4 text-center text-xs text-[#1e1e1e] md:text-sm lg:text-base">
        Hello, investor!
        <br />
        {isLoggedIn && `You are logged in with ${email}`}
        {!isLoggedIn && "Log in to save your portfolio settings!"}
      </footer>
    </>
  );
}

export default Footer;
