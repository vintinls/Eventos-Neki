import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import HomeEventos from '../pages/HomeEventos';
import Header from '../components/Header';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Header /> {/* Header fixo em todas as páginas */}
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<HomeEventos />} />
      </Routes>
    </BrowserRouter>
  );
}
