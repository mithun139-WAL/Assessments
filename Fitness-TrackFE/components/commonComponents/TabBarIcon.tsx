import React from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

export type TabBarIconProps = IconProps<ComponentProps<typeof Ionicons>['name']> & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'large' | 'small' | 'highlighted';
};

export function TabBarIcon({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: TabBarIconProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const iconSize = type === 'large' ? 32 : type === 'small' ? 18 : 24;

  return (
    <Ionicons
      size={iconSize}
      style={[
        { color, marginBottom: -3 },
        type === 'highlighted' ? styles.highlighted : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  highlighted: {
    backgroundColor: '#ffdd57',
    padding: 5,
    borderRadius: 10,
  },
});
