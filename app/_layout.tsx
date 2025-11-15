// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

export default function Layout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <Stack
        initialRouteName="index"  // força abrir na tela inicial
        screenOptions={{ headerShown: false }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg }
});
