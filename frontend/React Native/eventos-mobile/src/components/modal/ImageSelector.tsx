import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

type Modo = 'url' | 'upload';

interface Props {
  modoImagem: Modo;
  setModoImagem: (m: Modo) => void;
  imagemUrl: string;
  setImagemUrl: (u: string) => void;
  imagemFile: { uri: string; name: string; type: string } | null;
  escolherImagem: () => void;
  errorUrl?: string;
  errorFile?: string;
}

export default function ImageSelector({
  modoImagem,
  setModoImagem,
  imagemUrl,
  setImagemUrl,
  imagemFile,
  escolherImagem,
  errorUrl,
  errorFile,
}: Props) {
  return (
    <View style={{ marginVertical: 8 }}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setModoImagem('url')}
          style={[styles.toggle, modoImagem === 'url' && styles.active]}
        >
          <Text style={styles.toggleText}>URL</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModoImagem('upload')}
          style={[styles.toggle, modoImagem === 'upload' && styles.active]}
        >
          <Text style={styles.toggleText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {modoImagem === 'url' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder='URL da imagem'
            placeholderTextColor='#aaa'
            value={imagemUrl}
            onChangeText={setImagemUrl}
          />
          {errorUrl && <Text style={styles.error}>{errorUrl}</Text>}
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.pickBtn} onPress={escolherImagem}>
            <Text style={styles.pickBtnText}>
              {imagemFile
                ? `Selecionado: ${imagemFile.name}`
                : 'Selecionar imagem'}
            </Text>
          </TouchableOpacity>
          {imagemFile && (
            <Image
              source={{ uri: imagemFile.uri }}
              style={styles.preview}
              resizeMode='cover'
            />
          )}
          {errorFile && <Text style={styles.error}>{errorFile}</Text>}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  toggle: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#233A57',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  active: { backgroundColor: '#163554', borderColor: '#00ADB5' },
  toggleText: { color: '#E2E8F0', fontWeight: '600' },
  input: {
    backgroundColor: '#0F2742',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  pickBtn: {
    backgroundColor: '#163554',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#233A57',
  },
  pickBtnText: { color: '#E2E8F0' },
  preview: { marginTop: 8, width: '100%', height: 160, borderRadius: 8 },
  error: { color: '#ff6b6b', marginTop: 4 },
});
