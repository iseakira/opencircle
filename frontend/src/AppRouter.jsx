import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Input_email from './pages/Input_email.jsx';
import Mypage from './pages/Mypage.jsx';
import EditCircle from "./pages/EditCircle";

function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/input_email" element={<Input_email />} />
        <Route path="/Mypage" element={<Mypage />} />
        <Route path="/edit-circle/:circleId" element={<EditCircle />} />
      </Routes>
    </>
  );
}

export default AppRouter;
