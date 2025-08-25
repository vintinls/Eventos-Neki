import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCredenciais = localStorage.getItem('credenciais');
    if (savedCredenciais) {
      const { email, senha } = JSON.parse(savedCredenciais);
      setEmail(email);
      setSenha(senha);
      setLembrar(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, administrador } = response.data;

      if (lembrar) {
        localStorage.setItem('token', token);
        localStorage.setItem('credenciais', JSON.stringify({ email, senha }));
      } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('credenciais');
      }

      localStorage.setItem('admin', JSON.stringify(administrador));
      navigate('/home');
    } catch {
      setErro('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#112D4E] px-4'>
      <div className='w-full max-w-md rounded-xl bg-[#0B1E34]/90 p-8 shadow-xl backdrop-blur-md'>
        <h1 className='mb-6 text-center text-2xl font-bold text-[#00ADB5]'>
          Login do Administrador
        </h1>

        {erro && (
          <div className='mb-4 rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-300'>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-200'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='mt-1 w-full rounded-lg border border-gray-600 bg-[#0F2742] px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
              placeholder='seu@email.com'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-200'>
              Senha
            </label>
            <div className='relative'>
              <input
                type={showSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className='mt-1 w-full rounded-lg border border-gray-600 bg-[#0F2742] px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
                placeholder='Digite sua senha'
              />
              <button
                type='button'
                onClick={() => setShowSenha((s) => !s)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white'
              >
                {showSenha ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between text-sm text-gray-300'>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className='h-4 w-4 rounded border-gray-500 bg-[#0F2742] text-[#00ADB5] focus:ring-[#00ADB5]'
              />
              Gravar senha
            </label>

            <Link to='/register' className='text-[#00ADB5] hover:underline'>
              Cadastre-se
            </Link>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-[#00ADB5] px-4 py-2 font-semibold text-white shadow-md transition hover:bg-[#00949A] disabled:opacity-60'
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
