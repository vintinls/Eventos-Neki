import React from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
}

export default function FormInput({
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  editable = true,
}: Props) {
  return (
    <View style={{ marginBottom: 8 }}>
      <TextInput
        style={[styles.input, !editable && styles.readonlyInput]}
        placeholder={placeholder}
        placeholderTextColor='#aaa'
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        editable={editable}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#0F2742',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  readonlyInput: {
    backgroundColor: '#1E2A3C',
    color: '#AAB1BA',
  },
  error: { color: '#ff6b6b', marginTop: 4 },
});
