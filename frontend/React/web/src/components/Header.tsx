import logo from '../assets/neki-logo.png'; // ajuste o caminho se necessário

export default function Header() {
  return (
    <header className='w-full bg-[#0A192F] border-b border-gray-700 shadow-md'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-6 py-4'>
        {/* Logo + Título */}
        <div className='flex items-center gap-3'>
          <img src={logo} alt='Logo Neki' className='h-10 w-auto' />
          <span className='text-xl font-bold text-[#00ADB5]'>
            Gerenciador de Eventos
          </span>
        </div>
      </div>
    </header>
  );
}
