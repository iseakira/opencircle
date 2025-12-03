import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Input_email from './pages/Input_email.jsx';
import Mypage from './pages/Mypage.jsx';
import EditCircle from "./pages/EditCircle";
import CircleAdd from './pages/CircleAdd.jsx';
import Make_Account from './pages/Make_Account.jsx';
import Circle_Page from './pages/Circle_Page.jsx'
import { NotFound } from './pages/NotFound.jsx';

function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/input_email" element={<Input_email />} />
        <Route path="/edit-circle/:circleId" element={<EditCircle />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/add_circle" element={<CircleAdd/>}/>
        <Route path="/Make_Account" element={<Make_Account/>}/>
        <Route path="/Circle_Page/:id" element={<Circle_Page />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default AppRouter;
