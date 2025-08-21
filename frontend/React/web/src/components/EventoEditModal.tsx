import { useState } from 'react';

interface Props {
  evento: {
    id: number;
    nome: string;
    data: string;
    localizacao: string;
  };
  onClose: () => void;
  onSave: (id: number, novaData: string, novaLocal: string) => void;
}

export default function EventoEditModal({ evento, onClose, onSave }: Props) {
  const [data, setData] = useState(evento.data.split('T')[0]);
  const [localizacao, setLocalizacao] = useState(evento.localizacao);

  const [errors, setErrors] = useState<{ data?: string; localizacao?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { data?: string; localizacao?: string } = {};
    if (!data.trim()) newErrors.data = 'A data é obrigatória.';
    if (!localizacao.trim())
      newErrors.localizacao = 'A localização é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(evento.id, data, localizacao);
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50'>
      <div className='bg-[#0B1E34] p-8 rounded-xl shadow-2xl w-full max-w-md text-white'>
        <h2 className='text-2xl font-bold text-[#00ADB5] mb-6 text-center'>
          Editar Evento
        </h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Nome (só exibe, não editável) */}
          <div>
            <input
              type='text'
              value={evento.nome}
              disabled
              className='w-full rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 text-gray-300 cursor-not-allowed'
            />
          </div>

          {/* Data */}
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

          {/* Localização */}
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
