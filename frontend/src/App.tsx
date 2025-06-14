import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import monte_carlo_bg from "./assets/monte_carlo_bg.svg";
import { AuthProvider } from "./auth/AuthContext";
import Spinner from "./spinner/Spinner";
import Navbar from "./nav/Navbar";
import Footer from "./footer/Footer";
const Login = lazy(() => import("./auth/Login"));
const Sim = lazy(() => import("./simulation/Sim"));
const Signup = lazy(() => import("./signup/Signup"));

function App() {
  return (
    <>
      <img
        src={monte_carlo_bg}
        alt=""
        className="fixed inset-0 -z-20 h-full w-full object-cover"
      />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route index element={<Sim />}></Route>
              <Route path="login" element={<Login />}></Route>
              <Route path="signup" element={<Signup />}></Route>
            </Routes>
          </Suspense>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
