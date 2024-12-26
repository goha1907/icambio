import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../components/pages/Home';
import Login from '../components/pages/Login';
import Register from '../components/pages/Register';
import Profile from '../components/pages/Profile';
import Branches from '../components/pages/Branches';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
 <Routes>
   <Route path="/" element={<Layout />}>
     <Route index element={<Home />} />
     <Route path="login" element={<Login />} />
     <Route path="register" element={<Register />} />
     <Route path="branches" element={<Branches />} />
     
     <Route element={<ProtectedRoute />}>
       <Route path="profile" element={<Profile />} />
     </Route>
   </Route>
 </Routes>
);

export default AppRoutes;