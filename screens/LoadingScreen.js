import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { lightColors, darkColors } from '../styles/theme';

export default function LoadingScreen({ onLayout }) {
  const { themeMode } = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  const theme = themeMode === 'auto' ? (systemTheme === 'dark' ? darkColors : lightColors) : (themeMode === 'dark' ? darkColors : lightColors);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]} onLayout={onLayout}>
      <ActivityIndicator size="large" color={theme.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
