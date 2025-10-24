import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Input_email from './pages/Input_email.jsx';
import Mypage from './pages/Mypage.jsx';

function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/input_email" element={<Input_email />} />
        <Route path="/Mypage" element={<Mypage />} />
      </Routes>
    </>
  );
}

export default AppRouter;
