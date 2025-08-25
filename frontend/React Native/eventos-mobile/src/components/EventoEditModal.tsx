import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import DatePickerField from '../components/modal/DatePickerField';
import FormInput from '../components/modal/FormInput';
import ModalButtons from '../components/modal/ModalButtons';

export interface Evento {
  id: number;
  nome: string;
  data: string;
  localizacao: string;
  imagemUrl?: string;
}

interface Props {
  visible: boolean;
  evento: Evento | null;
  onClose: () => void;
  onSave: (id: number, novaData: string, novaLocal: string) => void;
}

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseToDate(value: string | undefined): Date {
  if (!value) return new Date();
  if (value.includes('T')) {
    const dt = new Date(value);
    return isNaN(dt.getTime()) ? new Date() : dt;
  }
  const dt = new Date(`${value}T00:00:00`);
  return isNaN(dt.getTime()) ? new Date() : dt;
}

export default function EventoEditModal({
  visible,
  evento,
  onClose,
  onSave,
}: Props) {
  const [dateObj, setDateObj] = useState<Date>(new Date());
  const [dataTexto, setDataTexto] = useState<string>('');
  const [localizacao, setLocalizacao] = useState<string>('');
  const [errors, setErrors] = useState<{ data?: string; localizacao?: string }>(
    {}
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (evento) {
      const base = parseToDate(evento.data);
      setDateObj(base);
      setDataTexto(toYYYYMMDD(base));
      setLocalizacao(evento.localizacao || '');
      setErrors({});
    }
  }, [evento, visible]);

  const validate = () => {
    const newErrors: { data?: string; localizacao?: string } = {};
    if (!dataTexto.trim()) newErrors.data = 'A data é obrigatória.';
    if (!localizacao.trim())
      newErrors.localizacao = 'A localização é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate() || !evento) return;
    try {
      setSaving(true);

      const dataFinal = toYYYYMMDD(dateObj);

      onSave(evento.id, dataFinal, localizacao);

      setSaving(false);
    } catch (err) {
      console.error('Erro ao editar evento:', err);
      Alert.alert('Erro', 'Não foi possível editar o evento.');
      setSaving(false);
    }
  };

  if (!evento) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          style={{ width: '90%' }}
        >
          <View style={styles.modal}>
            <Text style={styles.title}>Editar Evento</Text>

            <FormInput
              placeholder='Nome do evento'
              value={evento.nome}
              onChangeText={() => {}}
              editable={false}
            />

            <DatePickerField
              date={dateObj}
              onChange={(d, str) => {
                setDateObj(d);
                setDataTexto(str);
              }}
              error={errors.data}
            />

            <FormInput
              placeholder='Localização'
              value={localizacao}
              onChangeText={setLocalizacao}
              error={errors.localizacao}
            />

            <ModalButtons
              onCancel={onClose}
              onSave={handleSave}
              canSave={!!dataTexto.trim() && !!localizacao.trim()}
              saving={saving}
            />
          </View>
        </KeyboardAvoidingView>
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
    width: '100%',
    backgroundColor: '#0B1E34',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ADB5',
    textAlign: 'center',
    marginBottom: 16,
  },
});
