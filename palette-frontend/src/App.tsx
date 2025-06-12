import { BrowserRouter, Routes, Route } from "react-router-dom";
//import { BillingPage } from './BillingPage'
import { ChatPage } from "./pages/ChatPage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        {/* <Route path="/billing" element={<BillingPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
