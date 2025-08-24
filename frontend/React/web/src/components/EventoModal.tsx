import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSave: (dados: {
    nome: string;
    data: string;
    localizacao: string;
    imagemUrl?: string;
    imagemFile?: File | null;
    modoImagem: 'url' | 'upload';
  }) => void;
}

export default function EventoModal({ onClose, onSave }: Props) {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [modoImagem, setModoImagem] = useState<'url' | 'upload'>('url');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim()) newErrors.nome = 'O nome do evento é obrigatório.';
    if (!data.trim()) newErrors.data = 'A data do evento é obrigatória.';
    if (!localizacao.trim())
      newErrors.localizacao = 'A localização é obrigatória.';

    if (modoImagem === 'url') {
      if (!imagemUrl.trim())
        newErrors.imagemUrl = 'A URL da imagem é obrigatória.';
    } else {
      if (!imagemFile)
        newErrors.imagemFile = 'Você deve selecionar um arquivo de imagem.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({ nome, data, localizacao, imagemUrl, imagemFile, modoImagem });
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'>
      <div className='bg-[#0B1E34] p-8 rounded-xl shadow-2xl w-full max-w-md text-white'>
        <h2 className='text-2xl font-bold text-[#00ADB5] mb-6 text-center'>
          Novo Evento
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <input
              type='text'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder='Nome do evento'
              className='w-full rounded-lg bg-[#0F2742] border border-gray-600 px-3 py-2 outline-none text-white focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
            />
            {errors.nome && (
              <p className='text-red-400 text-sm mt-1'>{errors.nome}</p>
            )}
          </div>

          <div>
            <input
              type='date'
              value={data}
              onChange={(e) => setData(e.target.value)}
              className='w-full rounded-lg bg-[#0F2742] border border-gray-600 px-3 py-2 outline-none text-white focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
            />
            {errors.data && (
              <p className='text-red-400 text-sm mt-1'>{errors.data}</p>
            )}
          </div>

          <div>
            <input
              type='text'
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
              placeholder='Localização'
              className='w-full rounded-lg bg-[#0F2742] border border-gray-600 px-3 py-2 outline-none text-white focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
            />
            {errors.localizacao && (
              <p className='text-red-400 text-sm mt-1'>{errors.localizacao}</p>
            )}
          </div>

          <div className='flex space-x-6 text-gray-300'>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                checked={modoImagem === 'url'}
                onChange={() => setModoImagem('url')}
              />
              URL
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='radio'
                checked={modoImagem === 'upload'}
                onChange={() => setModoImagem('upload')}
              />
              Upload
            </label>
          </div>

          {modoImagem === 'url' ? (
            <div>
              <input
                type='text'
                value={imagemUrl}
                onChange={(e) => setImagemUrl(e.target.value)}
                placeholder='URL da imagem'
                className='w-full rounded-lg bg-[#0F2742] border border-gray-600 px-3 py-2 outline-none text-white focus:border-[#00ADB5] focus:ring-2 focus:ring-[#00ADB5]/50'
              />
              {errors.imagemUrl && (
                <p className='text-red-400 text-sm mt-1'>{errors.imagemUrl}</p>
              )}
            </div>
          ) : (
            <div>
              <input
                type='file'
                onChange={(e) =>
                  setImagemFile(e.target.files ? e.target.files[0] : null)
                }
                className='w-full text-gray-300'
              />
              {errors.imagemFile && (
                <p className='text-red-400 text-sm mt-1'>{errors.imagemFile}</p>
              )}
            </div>
          )}

          <div className='flex justify-end gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 rounded-lg border border-gray-500 text-gray-300 hover:text-white hover:border-white transition'
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='px-4 py-2 rounded-lg bg-[#00ADB5] hover:bg-[#00949A] text-white font-semibold shadow-lg'
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
