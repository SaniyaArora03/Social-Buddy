import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormPage from "./components/FormPage";

import AutismPage from "./pages/AutismPage";
import DyslexiaPage from "./pages/DyslexiaPage";
import DyscalculiaPage from "./pages/DyscalculiaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/autism" element={<AutismPage />} />
        <Route path="/dyslexia" element={<DyslexiaPage />} />
        <Route path="/dyscalculia" element={<DyscalculiaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
