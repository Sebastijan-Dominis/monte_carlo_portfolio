import { useAuth } from "../auth/AuthContext";

function Footer() {
  const { isLoggedIn, email } = useAuth();

  return (
    <>
      {isLoggedIn && (
        <footer className="fixed bottom-2 left-1/2 w-[80dvw] -translate-x-1/2 text-center text-[#1e1e1e]">
          Hello, investor!
          <br />
          You are logged in with {email}
        </footer>
      )}
      {!isLoggedIn && (
        <footer className="fixed bottom-2 left-1/2 w-[80dvw] -translate-x-1/2 text-center text-[#1e1e1e]">
          Hello, investor!
          <br />
          Log in to save your portfolio settings!
        </footer>
      )}
    </>
  );
}

export default Footer;
