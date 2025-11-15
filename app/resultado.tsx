// app/resultado.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { COLORS } from "../styles/theme";

export default function Resultado() {
  const router = useRouter();
  const params = useLocalSearchParams<{ correct?: string; pass?: string }>();
  const correct = params.correct ? Number(params.correct) : 0;
  const pass = params.pass ? Number(params.pass) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fim da rodada!</Text>
      <Text style={styles.subtitle}>
        ✅ Acertos: {correct}{"\n"}
        ❌ Erros/Pulos: {pass}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/categorias")} // volta para escolha de categorias
      >
        <Text style={styles.buttonText}>Voltar para categorias</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.bg,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    color: COLORS.softText,
    marginBottom: 24,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
  },
});