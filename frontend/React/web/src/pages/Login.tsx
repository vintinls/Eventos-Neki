import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email, 'Senha:', senha, 'Lembrar:', lembrar);
    // depois aqui chamaremos a API do backend
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-2xl font-bold text-center text-blue-600 mb-6'>
          Login do Administrador
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Campo Email */}
          <div>
            <label className='block text-gray-700 mb-1'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Digite seu email'
              required
            />
          </div>

          {/* Campo Senha */}
          <div>
            <label className='block text-gray-700 mb-1'>Senha</label>
            <input
              type='password'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Digite sua senha'
              required
            />
          </div>

          {/* Checkbox lembrar senha */}
          <div className='flex items-center'>
            <input
              type='checkbox'
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
              className='mr-2'
            />
            <span className='text-gray-600'>Gravar senha</span>
          </div>

          {/* Botão Entrar */}
          <button
            type='submit'
            className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition'
          >
            Entrar
          </button>

          {/* Botão Cadastrar-se */}
          <button
            type='button'
            className='w-full border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition'
            onClick={() => navigate('/register')}
          >
            Cadastrar-se
          </button>
        </form>
      </div>
    </div>
  );
}
