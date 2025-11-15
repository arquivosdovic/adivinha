// app/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../styles/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adivinha 🎉</Text>
      <Text style={styles.subtitle}>Escolha uma categoria e divirta-se!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/categorias')}
      >
        <Text style={styles.buttonText}>Ver Categorias</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { marginTop: 12 }]}
        onPress={() => router.push('/categorias/criar')}
      >
        <Text style={styles.buttonText}>Criar Categoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.bg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.softText,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
