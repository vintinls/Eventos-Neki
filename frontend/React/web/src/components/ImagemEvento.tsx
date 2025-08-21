import { useEffect, useState } from 'react';
import api from '../services/api';

interface ImagemEventoProps {
  imagemUrl?: string;
  alt: string;
  className?: string;
}

export default function ImagemEvento({
  imagemUrl,
  alt,
  className,
}: ImagemEventoProps) {
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      if (!imagemUrl) return;

      // URL externa → usa direto
      if (imagemUrl.startsWith('http')) {
        setSrc(imagemUrl);
        return;
      }

      try {
        // Usa axios com token automático
        const response = await api.get(imagemUrl, {
          responseType: 'blob',
        });

        const blob = response.data;
        setSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
      }
    };

    loadImage();
  }, [imagemUrl]);

  return src ? (
    <img src={src} alt={alt} className={className} />
  ) : (
    <div className='w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500'>
      Imagem ou URL não Reconhecida
    </div>
  );
}
