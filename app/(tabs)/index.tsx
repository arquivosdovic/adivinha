import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Jogo() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse words array
  const words: string[] = params.words ? JSON.parse(params.words as string) : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [background, setBackground] = useState("#000");
  const [lastAction, setLastAction] = useState<"none" | "correct" | "pass">("none");
  const [seconds, setSeconds] = useState(60);

  // Travar tela na horizontal
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // Retorna para retrato ao sair
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Acelerômetro
  useEffect(() => {
    Accelerometer.setUpdateInterval(200);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      // No modo horizontal, consideramos o eixo y para cima/baixo
      if (y < -0.7 && lastAction !== "correct") {
        handleCorrect();
        setLastAction("correct");
        setTimeout(() => setLastAction("none"), 1200);
      }
      if (y > 0.7 && lastAction !== "pass") {
        handlePass();
        setLastAction("pass");
        setTimeout(() => setLastAction("none"), 1200);
      }
    });

    return () => sub.remove();
  }, [currentIndex, lastAction]);

  const handleCorrect = () => {
    setBackground("#0f0"); // verde
    setCorrectCount((c) => c + 1);
    setTimeout(() => {
      setBackground("#000");
      nextWord();
    }, 700);
  };

  const handlePass = () => {
    setBackground("#555"); // cinza
    setTimeout(() => {
      setBackground("#000");
      nextWord();
    }, 700);
  };

  const nextWord = () => {
    if (currentIndex + 1 >= words.length) {
      endGame();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const endGame = () => {
    router.replace({
      pathname: "/resultado",
      params: { score: correctCount },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Text style={styles.timer}>Tempo: {seconds}s</Text>
      <Text style={styles.word}>
        {words[currentIndex] ?? "Carregando..."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  word: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
  },
  timer: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 20,
  },
});
