import { useEffect, useState } from 'react';

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
  const [failed, setFailed] = useState<boolean>(false);

  useEffect(() => {
    let revoked: string | null = null;
    setSrc('');
    setFailed(false);

    const loadImage = async () => {
      if (!imagemUrl) return;

      if (imagemUrl.startsWith('http')) {
        setSrc(imagemUrl);
        return;
      }

      try {
        const token =
          localStorage.getItem('token') || sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:8080${imagemUrl}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          setFailed(true);
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        revoked = url;
        setSrc(url);
      } catch {
        setFailed(true);
      }
    };

    loadImage();

    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [imagemUrl]);

  if (failed || !src) {
    return (
      <div
        className={`flex items-center justify-center text-gray-300 text-sm italic bg-gray-700/40 ${className}`}
      >
        Não foi possível carregar a imagem
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading='lazy'
      onError={() => {
        setFailed(true);
        setSrc('');
      }}
    />
  );
}
