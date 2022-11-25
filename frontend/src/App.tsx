import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CallbackAuth from "./pages/Callback/Callback";
import Profile from "./pages/Profile";
import { CookiesProvider } from "react-cookie";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <CookiesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<CallbackAuth />} />
          <Route path="/:username" element={<Profile />} />
        </Routes>
      </CookiesProvider>
    </BrowserRouter>
  );
}

export default App;
