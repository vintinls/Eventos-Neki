import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/neki-logo.png';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('admin');
    sessionStorage.removeItem('admin');
    navigate('/');
  };

  const mostrarLogout = location.pathname.startsWith('/home');

  return (
    <header className='w-full bg-[#0A192F] border-b border-gray-700 shadow-md'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        <div className='flex items-center gap-3'>
          <img src={logo} alt='Logo Neki' className='h-10 w-auto' />
          <span className='text-xl font-bold text-[#00ADB5]'>
            Gerenciador de Eventos
          </span>
        </div>

        {mostrarLogout && (
          <button
            onClick={handleLogout}
            className='rounded-lg bg-[#00ADB5] px-4 py-2 font-semibold text-white shadow-md hover:bg-[#00949A] transition'
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
