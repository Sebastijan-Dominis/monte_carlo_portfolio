import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import monte_carlo_bg from "./assets/monte_carlo_bg.svg";
import { AuthProvider } from "./auth/AuthContext";
import Spinner from "./spinner/Spinner";
import Navbar from "./nav/Navbar";
import Footer from "./footer/Footer";
import PrivateRoute from "./protected_routes/PrivateRoute";

const Login = lazy(() => import("./auth/Login"));
const Sim = lazy(() => import("./simulation/Sim"));
const Signup = lazy(() => import("./signup/Signup"));
const Instructions = lazy(() => import("./simulation/Instructions"));
const Saved = lazy(() => import("./settings/Settings"));

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
          <div className="h-[88dvh] overflow-y-scroll pt-16">
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route index element={<Sim />} />
                <Route
                  path="login"
                  element={
                    <PrivateRoute>
                      <Login />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="signup"
                  element={
                    <PrivateRoute>
                      <Signup />
                    </PrivateRoute>
                  }
                />
                <Route path="instructions" element={<Instructions />} />
                <Route path="settings" element={<Saved />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
