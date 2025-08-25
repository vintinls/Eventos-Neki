import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import FormInput from '../components/modal/FormInput';
import DatePickerField from '../components/modal/DatePickerField';
import ImageSelector from '../components/modal/ImageSelector';
import ModalButtons from '../components/modal/ModalButtons';

type Modo = 'url' | 'upload';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (dados: {
    nome: string;
    data: string;
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDataTexto(toYYYYMMDD(dateObj));
  }, [dateObj]);

  // reset quando fecha modal
  useEffect(() => {
    if (!visible) {
      const now = new Date();
      setNome('');
      setLocalizacao('');
      setImagemUrl('');
      setImagemFile(null);
      setModoImagem('url');
      setErrors({});
      setDateObj(now);
      setDataTexto(toYYYYMMDD(now));
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
      if (!imagemFile) e.imagemFile = 'Você deve selecionar um arquivo.';
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

    const size = (asset as any).fileSize as number | undefined;
    if (size && size > MAX_BYTES) {
      Alert.alert('Arquivo grande', 'Selecione uma imagem de até 5 MB.');
      return;
    }
    if (!ALLOWED.includes(typeGuess)) {
      Alert.alert('Tipo inválido', 'Use JPG, PNG ou WEBP.');
      return;
    }

    setImagemFile({ uri: asset.uri, name: nameGuess, type: typeGuess });
    setErrors((prev) => {
      const { imagemFile, ...rest } = prev;
      return rest;
    });
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
      data: dataTexto,
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

            <FormInput
              placeholder='Nome do evento'
              value={nome}
              onChangeText={setNome}
              error={errors.nome}
            />

            <DatePickerField
              date={dateObj}
              onChange={setDateObj}
              error={errors.data}
            />

            <FormInput
              placeholder='Localização'
              value={localizacao}
              onChangeText={setLocalizacao}
              error={errors.localizacao}
            />

            <ImageSelector
              modoImagem={modoImagem}
              setModoImagem={setModoImagem}
              imagemUrl={imagemUrl}
              setImagemUrl={setImagemUrl}
              imagemFile={imagemFile}
              escolherImagem={escolherImagem}
              errorUrl={errors.imagemUrl}
              errorFile={errors.imagemFile}
            />

            <ModalButtons
              onCancel={onClose}
              onSave={handleSave}
              canSave={canSave}
              saving={saving}
            />
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
});
