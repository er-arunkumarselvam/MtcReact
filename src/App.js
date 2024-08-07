import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import ProtectedRoute from "./router/ProtectedRoute";
import { UserNavbar } from "./components/UserNavbar";
import { AdminNavbar } from "./components/AdminNavbar";
import Login from "./pages/User/Login";
import Scanner from "./pages/User/Scanner";
import Form from "./pages/User/Form";
import Home from "./pages/Admin/Home";
import UserDetails from "./pages/Admin/UserDetails";
import VehicleDetails from "./pages/Admin/VehicleDetails";
import InspectionDetails from "./pages/Admin/InspectionDetails";
import UserRegister from "./pages/Admin/UserRegister";
import VehicleRegister from "./pages/Admin/VehicleRegister";
import FormData from "./components/FormData";
import SelectRole from './pages/Admin/SelectRole'; 
import Record from "./pages/User/Record";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isUserRoute = location.pathname.startsWith('/scanner') || location.pathname.startsWith('/form') || location.pathname.startsWith('/record');
  const isAdminRoute = location.pathname.startsWith('/home') || location.pathname.startsWith('/user-details') || location.pathname.startsWith('/vehicle-details') || location.pathname.startsWith('/inspection-details') || location.pathname.startsWith('/user-register') || location.pathname.startsWith('/vehicle-register');

  return (
    <>
      {isUserRoute && <UserNavbar />}
      {isAdminRoute && <AdminNavbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
        <Route path="/formData" element={<ProtectedRoute><FormData /></ProtectedRoute>} />
        <Route path="/form" element={<ProtectedRoute><Form /></ProtectedRoute>} />
        <Route path="/record" element={<ProtectedRoute><Record/></ProtectedRoute>} />
        <Route path="/select-role" element={<ProtectedRoute><SelectRole /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/user-details" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
        <Route path="/vehicle-details" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
        <Route path="/inspection-details" element={<ProtectedRoute><InspectionDetails /></ProtectedRoute>} />
        <Route path="/user-register" element={<ProtectedRoute><UserRegister /></ProtectedRoute>} />
        <Route path="/vehicle-register" element={<ProtectedRoute><VehicleRegister /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

export default App;
