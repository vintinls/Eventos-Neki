import { useState } from 'react';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    console.log('Nome:', nome, 'Email:', email, 'Senha:', senha);
    // depois aqui chamaremos a API do backend
    alert('Cadastro realizado com sucesso!');
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-2xl font-bold text-center text-blue-600 mb-6'>
          Cadastro de Administrador
        </h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Nome */}
          <div>
            <label className='block text-gray-700 mb-1'>Nome</label>
            <input
              type='text'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Digite seu nome'
              required
            />
          </div>

          {/* Email */}
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

          {/* Senha */}
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

          {/* Confirmar Senha */}
          <div>
            <label className='block text-gray-700 mb-1'>Confirmar Senha</label>
            <input
              type='password'
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Repita a senha'
              required
            />
          </div>

          {/* Botão cadastrar */}
          <button
            type='submit'
            className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition'
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
