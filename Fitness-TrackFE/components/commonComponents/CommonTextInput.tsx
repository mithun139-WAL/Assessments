import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { Colors } from '../../constants/Colors';

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
    borderColor: Colors.darkgray,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    color: Colors.blue,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.black,
  },
});
