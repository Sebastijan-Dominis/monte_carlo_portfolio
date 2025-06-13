import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import monte_carlo_bg from "./assets/monte_carlo_bg.svg";

function App() {
  return (
    <>
      <img
        src={monte_carlo_bg}
        alt=""
        className="fixed inset-0 -z-20 h-full w-full object-cover"
      />
      <BrowserRouter>
        <Routes></Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
