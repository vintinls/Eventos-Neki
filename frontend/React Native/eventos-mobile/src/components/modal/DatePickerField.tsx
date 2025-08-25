import React, { useState } from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  date: Date;
  onChange: (date: Date, formatted: string) => void;
  error?: string;
}

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function DatePickerField({ date, onChange, error }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selected?: Date) => {
    if (selected) {
      onChange(selected, toYYYYMMDD(selected));
    }
    if (Platform.OS === 'android') setShowPicker(false);
  };

  return (
    <View style={{ marginBottom: 8 }}>
      {Platform.OS === 'android' ? (
        <>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={[styles.input, styles.touchableInput]}
          >
            <Text style={styles.text}>{toYYYYMMDD(date)}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={date}
              mode='date'
              display='calendar'
              onChange={handleChange}
            />
          )}
        </>
      ) : (
        <DateTimePicker
          value={date}
          mode='date'
          display='inline'
          onChange={handleChange}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#0F2742',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  touchableInput: { justifyContent: 'center' },
  text: { color: '#fff' },
  error: { color: '#ff6b6b', marginTop: 4 },
});
