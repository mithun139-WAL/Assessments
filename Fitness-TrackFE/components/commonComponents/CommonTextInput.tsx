// CommonTextInput.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ThemedText } from './ThemedText';

interface CommonTextInputProps extends TextInputProps {
  label?: string;
}

const CommonTextInput: React.FC<CommonTextInputProps> = ({ label, style, ...rest }) => {
  return (
    <>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#ddd"
        {...rest}
      />
    </>
  );
};

export default CommonTextInput;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: "#ddd",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    color: "#66BB6A",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#388E3C",
  },
});
