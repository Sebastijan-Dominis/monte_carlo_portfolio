import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import monte_carlo_bg from "./assets/monte_carlo_bg.svg";
import { AuthProvider } from "./auth/AuthContext";
import { SettingsProvider } from "./settings_mc_context/SettingsContext";
import Spinner from "./spinner/Spinner";
import Navbar from "./nav/Navbar";
import Footer from "./footer/Footer";
import PrivateRouteLoggedOut from "./protected_routes/PrivateRouteLoggedOut";
import PrivateRouteLoggedIn from "./protected_routes/PrivateRouteLoggedIn";

const Login = lazy(() => import("./auth/Login"));
const Sim = lazy(() => import("./simulation/Sim"));
const Signup = lazy(() => import("./signup/Signup"));
const Saved = lazy(() => import("./settings/Settings"));

const Instructions = lazy(() => import("./simulation/Instructions"));
const AddSettings = lazy(() => import("./settings/AddSettings"));
const EditSettings = lazy(() => import("./settings/EditSettings"));

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
          <SettingsProvider>
            <Navbar />
            <div className="h-[88dvh] overflow-y-scroll pt-16">
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route index element={<Sim />} />
                  <Route
                    path="login"
                    element={
                      <PrivateRouteLoggedOut>
                        <Login />
                      </PrivateRouteLoggedOut>
                    }
                  />
                  <Route
                    path="signup"
                    element={
                      <PrivateRouteLoggedOut>
                        <Signup />
                      </PrivateRouteLoggedOut>
                    }
                  />
                  <Route path="instructions" element={<Instructions />} />
                  <Route path="settings" element={<Saved />} />
                  <Route
                    path="settings/add"
                    element={
                      <PrivateRouteLoggedIn>
                        <AddSettings />
                      </PrivateRouteLoggedIn>
                    }
                  />
                  <Route
                    path="settings/edit"
                    element={
                      <PrivateRouteLoggedIn>
                        <EditSettings />
                      </PrivateRouteLoggedIn>
                    }
                  />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
