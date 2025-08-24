// src/components/EventoModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Platform,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

type Modo = 'url' | 'upload';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (dados: {
    nome: string;
    data: string; // YYYY-MM-DD
    localizacao: string;
    imagemUrl?: string;
    imagemFile?: { uri: string; name: string; type: string } | null;
    modoImagem: Modo;
  }) => void;
}

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

export default function EventoModal({ visible, onClose, onSave }: Props) {
  const [nome, setNome] = useState('');
  const [dateObj, setDateObj] = useState<Date>(new Date());
  const [dataTexto, setDataTexto] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');

  const [modoImagem, setModoImagem] = useState<Modo>('url');
  const [imagemFile, setImagemFile] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDataTexto(toYYYYMMDD(dateObj));
  }, [dateObj]);

  // reset a cada fechamento
  useEffect(() => {
    if (!visible) {
      setNome('');
      setLocalizacao('');
      setImagemUrl('');
      setImagemFile(null);
      setModoImagem('url');
      setErrors({});
      const now = new Date();
      setDateObj(now);
      setDataTexto(toYYYYMMDD(now));
      setShowPicker(false);
      setSaving(false);
    }
  }, [visible]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nome.trim()) e.nome = 'O nome do evento é obrigatório.';
    if (!dataTexto.trim()) e.data = 'A data do evento é obrigatória.';
    if (!localizacao.trim()) e.localizacao = 'A localização é obrigatória.';

    if (modoImagem === 'url') {
      if (!imagemUrl.trim()) e.imagemUrl = 'A URL da imagem é obrigatória.';
    } else {
      if (!imagemFile)
        e.imagemFile = 'Você deve selecionar um arquivo de imagem.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const escolherImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão',
        'Precisamos da sua permissão para acessar as imagens.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.9,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];

    // Normaliza nome e tipo
    const nameGuess =
      asset.fileName ??
      (asset.uri.includes('/')
        ? asset.uri.split('/').pop() ?? `imagem_${Date.now()}.jpg`
        : `imagem_${Date.now()}.jpg`);

    let typeGuess = asset.mimeType;
    if (!typeGuess) {
      const lower = nameGuess.toLowerCase();
      if (lower.endsWith('.png')) typeGuess = 'image/png';
      else if (lower.endsWith('.webp')) typeGuess = 'image/webp';
      else typeGuess = 'image/jpeg';
    }

    // Valida tipo e tamanho
    const size = (asset as any).fileSize as number | undefined; // nem sempre vem
    if (size && size > MAX_BYTES) {
      Alert.alert('Arquivo grande', 'Selecione uma imagem de até 5 MB.');
      return;
    }
    if (!ALLOWED.includes(typeGuess)) {
      Alert.alert('Tipo inválido', 'Use JPG, PNG ou WEBP.');
      return;
    }

    setImagemFile({ uri: asset.uri, name: nameGuess, type: typeGuess });
    // limpar erro se tinha
    setErrors((prev) => {
      const { imagemFile, ...rest } = prev;
      return rest;
    });
  };

  const onChangeDate = (_event: any, selected?: Date) => {
    if (!selected) {
      if (Platform.OS === 'android') setShowPicker(false);
      return;
    }
    setDateObj(selected);
    if (Platform.OS === 'android') setShowPicker(false);
  };

  const canSave = useMemo(() => {
    if (!nome.trim() || !dataTexto.trim() || !localizacao.trim()) return false;
    if (modoImagem === 'url') return !!imagemUrl.trim();
    return !!imagemFile;
  }, [nome, dataTexto, localizacao, imagemUrl, imagemFile, modoImagem]);

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    onSave({
      nome,
      data: dataTexto, // a tela Home converte pra ISO com T00:00:00
      localizacao,
      imagemUrl: modoImagem === 'url' ? imagemUrl : undefined,
      imagemFile: modoImagem === 'upload' ? imagemFile : null,
      modoImagem,
    });
    setSaving(false);
  };

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>Novo Evento</Text>

            <TextInput
              style={styles.input}
              placeholder='Nome do evento'
              placeholderTextColor='#aaa'
              value={nome}
              onChangeText={setNome}
            />
            {errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

            <Text style={styles.label}>Data</Text>
            {Platform.OS === 'android' ? (
              <>
                <TouchableOpacity
                  onPress={() => setShowPicker(true)}
                  activeOpacity={0.8}
                  style={[styles.input, styles.touchableInput]}
                >
                  <Text style={styles.touchableInputText}>
                    {dataTexto || 'Selecionar data'}
                  </Text>
                </TouchableOpacity>
                {errors.data && <Text style={styles.error}>{errors.data}</Text>}
                {showPicker && (
                  <DateTimePicker
                    value={dateObj}
                    mode='date'
                    display='calendar'
                    onChange={onChangeDate}
                  />
                )}
              </>
            ) : (
              <>
                <View style={[styles.input, styles.iosPickerContainer]}>
                  <DateTimePicker
                    value={dateObj}
                    mode='date'
                    display='inline'
                    onChange={onChangeDate}
                  />
                </View>
                <Text style={styles.helperText}>{dataTexto}</Text>
                {errors.data && <Text style={styles.error}>{errors.data}</Text>}
              </>
            )}

            <TextInput
              style={styles.input}
              placeholder='Localização'
              placeholderTextColor='#aaa'
              value={localizacao}
              onChangeText={setLocalizacao}
            />
            {errors.localizacao && (
              <Text style={styles.error}>{errors.localizacao}</Text>
            )}

            {/* Toggle URL | Upload */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                onPress={() => setModoImagem('url')}
                style={[
                  styles.toggle,
                  modoImagem === 'url' && styles.toggleActive,
                ]}
              >
                <Text style={styles.toggleText}>URL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModoImagem('upload')}
                style={[
                  styles.toggle,
                  modoImagem === 'upload' && styles.toggleActive,
                ]}
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
                  autoCapitalize='none'
                />
                {errors.imagemUrl && (
                  <Text style={styles.error}>{errors.imagemUrl}</Text>
                )}
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.pickBtn}
                  onPress={escolherImagem}
                >
                  <Text style={styles.pickBtnText}>
                    {imagemFile
                      ? `Selecionado: ${imagemFile.name}`
                      : 'Selecionar imagem'}
                  </Text>
                </TouchableOpacity>
                {/* Preview */}
                {imagemFile ? (
                  <Image
                    source={{ uri: imagemFile.uri }}
                    style={styles.preview}
                    resizeMode='cover'
                  />
                ) : null}
                {errors.imagemFile && (
                  <Text style={styles.error}>{errors.imagemFile}</Text>
                )}
              </>
            )}

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !canSave || saving ? styles.saveButtonDisabled : null,
                ]}
                onPress={handleSave}
                disabled={!canSave || saving}
              >
                <Text style={styles.saveText}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#0B1E34',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ADB5',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: { color: '#9BB0C8', marginBottom: 6, fontWeight: '600' },
  input: {
    backgroundColor: '#0F2742',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  error: { color: '#ff6b6b', marginBottom: 6 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  cancelText: { color: '#aaa', fontWeight: 'bold' },
  saveButton: {
    backgroundColor: '#00ADB5',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveText: { color: '#fff', fontWeight: 'bold' },
  touchableInput: { justifyContent: 'center' },
  touchableInputText: { color: '#fff' },
  iosPickerContainer: { padding: 0, overflow: 'hidden' },
  helperText: { color: '#9BB0C8', marginBottom: 6 },
  toggleRow: { flexDirection: 'row', gap: 10, marginVertical: 6 },
  toggle: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#233A57',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleActive: { backgroundColor: '#163554', borderColor: '#00ADB5' },
  toggleText: { color: '#E2E8F0', fontWeight: '600' },
  pickBtn: {
    backgroundColor: '#163554',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#233A57',
  },
  pickBtnText: { color: '#E2E8F0' },
  preview: {
    marginTop: 8,
    width: '100%',
    height: 160,
    borderRadius: 8,
    backgroundColor: '#0F2742',
  },
});
