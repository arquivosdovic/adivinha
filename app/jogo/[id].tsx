import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Accelerometer } from "expo-sensors";
import * as ScreenOrientation from "expo-screen-orientation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { INITIAL_CATEGORIES } from "../../data/categories";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'HU_CUSTOM_CATEGORIES_v1';

export default function Jogo() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const categoryId = Number(params.id);

  const [wordsList, setWordsList] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [usedIndices, setUsedIndices] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [background, setBackground] = useState("#000");
  const [timeLeft, setTimeLeft] = useState(150); // 2m30s
  const [countdown, setCountdown] = useState(5); // contagem inicial

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActionRef = useRef<"none" | "correct" | "pass">("none");
  const correctRef = useRef(0);
  const passRef = useRef(0);

  // Travar tela na horizontal
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Carregar palavras da categoria (inicial + custom)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const customCategories = raw ? JSON.parse(raw) : [];
        const allCategories = [...INITIAL_CATEGORIES, ...customCategories];
        const category = allCategories.find((c: any) => c.id === categoryId);
        if (category?.palavras) {
          setWordsList(category.palavras);
        }
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [categoryId]);

  // Contagem inicial de 5 segundos
  useEffect(() => {
    if (countdown <= 0 || wordsList.length === 0) return;

    const cdInterval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) clearInterval(cdInterval);
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(cdInterval);
  }, [countdown, wordsList]);

  // Contador do jogo
  useEffect(() => {
    if (countdown > 0 || wordsList.length === 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [countdown, wordsList]);

  // Movimentos do celular
  useEffect(() => {
    if (countdown > 0 || wordsList.length === 0) return;

    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ z }) => {
      if (z < -0.7 && lastActionRef.current !== "correct") {
        handleCorrect();
        lastActionRef.current = "correct";
        setTimeout(() => (lastActionRef.current = "none"), 1000);
      }
      if (z > 0.7 && lastActionRef.current !== "pass") {
        handlePass();
        lastActionRef.current = "pass";
        setTimeout(() => (lastActionRef.current = "none"), 1000);
      }
    });

    return () => sub.remove();
  }, [countdown, currentWord, wordsList]);

  // Iniciar palavra aleatória
  useEffect(() => {
    if (countdown > 0 || wordsList.length === 0) return;
    nextWord();
  }, [countdown, wordsList]);

  const getRandomWordIndex = (): number => {
    if (usedIndices.length >= wordsList.length) return -1;
    let index;
    do {
      index = Math.floor(Math.random() * wordsList.length);
    } while (usedIndices.includes(index));
    return index;
  };

  const nextWord = () => {
    const idx = getRandomWordIndex();
    if (idx === -1) {
      endGame();
      return;
    }
    setCurrentWord(wordsList[idx]);
    setUsedIndices(u => [...u, idx]);
  };

  const handleCorrect = () => {
    setBackground("#0f0");
    setCorrectCount(c => {
      correctRef.current = c + 1;
      return correctRef.current;
    });
    setTimeout(() => {
      setBackground("#000");
      nextWord();
    }, 500);
  };

  const handlePass = () => {
    setBackground("#555");
    setPassCount(p => {
      passRef.current = p + 1;
      return passRef.current;
    });
    setTimeout(() => {
      setBackground("#000");
      nextWord();
    }, 500);
  };

  const endGame = () => {
    router.replace(`/resultado?correct=${correctRef.current}&pass=${passRef.current}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {countdown > 0 ? (
        <Text style={styles.word}>Começando em {countdown}...</Text>
      ) : (
        <>
          <Text style={styles.word}>{currentWord ?? "Carregando..."}</Text>
          <Text style={styles.timer}>Tempo: {timeLeft}s</Text>
          <Text style={styles.score}>
            ✅ {correctCount}  ❌ {passCount}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  word: { color: "#fff", fontSize: 42, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  timer: { color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  score: { color: "#fff", fontSize: 20 },
});