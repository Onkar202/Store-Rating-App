import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage"
import AdminUser from "./components/Pages/AdminUser/AdminUser";
import NormalUser from "./components/Pages/NormalUser/NormalUser";
import StoreOwner from "./components/Pages/StoreOwner/StoreOwner";

function App() {
  return (
    <>
     <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />               
                <Route path="/adminDashboard" element={<AdminUser />} />               
                <Route path="/normalDashboard" element={<NormalUser />} />               
                <Route path="/storeOwnerDashboard" element={<StoreOwner />} />               
            </Routes>
        </Router>
    </>
  );
}

export default App;
