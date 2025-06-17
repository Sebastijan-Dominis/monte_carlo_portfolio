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
const Signup = lazy(() => import("./auth/Signup"));
const Saved = lazy(() => import("./settings/Settings"));
const About = lazy(() => import("./about/About"));

const Instructions = lazy(() => import("./simulation/Instructions"));
const AddSettings = lazy(() => import("./settings/AddSettings"));
const EditSettings = lazy(() => import("./settings/EditSettings"));
const NotFound = lazy(() => import("./not_found/NotFound"));

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
            <div className="flex min-h-[100dvh] flex-col">
              <Navbar />
              <div className="flex-1 pt-4 md:pt-6 lg:pt-8">
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
                    <Route path="about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </div>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
