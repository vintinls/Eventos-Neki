import React, { useEffect, useState } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { API_BASE } from '../services/api';

interface Props {
  imagemUrl?: string;
  alt: string;
  style?: any;
}

export default function ImagemEvento({ imagemUrl, alt, style }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!imagemUrl) {
        setFailed(true);
        return;
      }

      let url = imagemUrl;

      if (!url.startsWith('http') || url.includes('localhost')) {
        url = `${API_BASE}${imagemUrl.replace('http://localhost:8080', '')}`;
      }

      try {
        const token = await AsyncStorage.getItem('token');
        const localPath = `${
          FileSystem.cacheDirectory
        }evento_${Date.now()}.jpg`;

        const res = await FileSystem.downloadAsync(url, localPath, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (active) setSrc(res.uri);
      } catch (e) {
        console.error('Erro carregando imagem:', e);
        setFailed(true);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [imagemUrl]);

  if (failed || !src) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>Sem imagem</Text>
      </View>
    );
  }

  return <Image source={{ uri: src }} style={style} resizeMode='cover' />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#1E2A3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: '#999' },
});
