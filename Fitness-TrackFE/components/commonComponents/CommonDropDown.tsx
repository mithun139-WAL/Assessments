import { StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from './ThemedView';
import DropDownPicker from 'react-native-dropdown-picker';

interface DropdownProps {
    items: Array<{ label: string; value: string }>;
    placeholder?: string;
    defaultValue?: string;
    onChangeValue: (value: string) => void;
    containerStyle?: ViewStyle;
    dropdownStyle?: ViewStyle;
    textStyle?: TextStyle;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
  

const CommonDropDown = ({
    items,
    placeholder = 'Select an option',
    defaultValue = '',
    onChangeValue,
    containerStyle,
    dropdownStyle,
    textStyle,
    open,
    setOpen,
  }: DropdownProps) => {
    const [value, setValue] = useState<string | null>(defaultValue);
  return (
    <ThemedView style={[styles.container, containerStyle]}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        onChangeValue={(val) => {
            if (val !== null) {
                setValue(val);
                onChangeValue(val);
              }
        }}
        placeholder={placeholder}
        style={[styles.dropdown, dropdownStyle]}
        textStyle={textStyle}
        dropDownContainerStyle={[
          styles.dropDownContainer,
        ]}
        dropDownDirection='TOP'
      />
    </ThemedView>
  )
}

export default CommonDropDown

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        width: '100%',
      },
      dropdown: {
        backgroundColor: '#fafafa',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        elevation: 1,
      },
      dropDownContainer: {
        borderColor: '#ddd',
      },
})