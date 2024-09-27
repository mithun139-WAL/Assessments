import React from 'react';
import { Text, StyleSheet, ViewStyle, TextStyle, Pressable, PressableProps } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type ComponentProps } from 'react';
import { ThemedText } from './ThemedText';
import { TabBarIcon } from './TabBarIcon';

interface ButtonProps extends PressableProps {
  title: string;
  iconName?: ComponentProps<typeof Ionicons>['name'];
  iconPosition?: 'left' | 'right';                    
  iconSize?: number;                                   
  iconColor?: string;                                  
  buttonStyle?: ViewStyle;                             
  textStyle?: TextStyle;                               
  iconStyle?: ViewStyle;                              
}

export function CommonButton({
  title,
  iconName,
  iconPosition = 'left',
  iconSize = 24,
  iconColor,
  buttonStyle,
  textStyle,
  iconStyle,
  ...rest
}: ButtonProps) {
  return (
    <Pressable style={[styles.button, buttonStyle]} {...rest}>
      {iconName && iconPosition === 'left' && (
        <TabBarIcon
          name={iconName}
          color={iconColor}
          style={[styles.icon, iconStyle]}
        />
      )}
      <ThemedText style={[styles.text, textStyle]}>{title}</ThemedText>
      {iconName && iconPosition === 'right' && (
        <TabBarIcon
          name={iconName}
          color={iconColor}
          style={[styles.icon, iconStyle]}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 35,
  },
  text: {
    fontSize: 14,
    marginHorizontal: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '500',
  },
  icon: {
    marginHorizontal: 5,
    marginBottom: 0
  },
});
