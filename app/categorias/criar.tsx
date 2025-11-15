import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS } from '../../styles/theme';

const STORAGE_KEY = 'HU_CUSTOM_CATEGORIES_v1';

export default function Criar() {
  const params = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [word, setWord] = useState('');
  const [palavras, setPalavras] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingWordIndex, setEditingWordIndex] = useState<number | null>(null);

  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importText, setImportText] = useState('');

  // Carregar categoria para edição
  useEffect(() => {
    const loadCategory = async () => {
      if (!params.id) return;
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      const cat = parsed.find((c: any) => c.id === Number(params.id));
      if (cat) {
        setNome(cat.nome);
        setPalavras(cat.palavras);
        setEditingId(cat.id);
      }
    };
    loadCategory();
  }, [params.id]);

  const addOrUpdateWord = () => {
    const t = word.trim();
    if (!t) return;
    if (editingWordIndex !== null) {
      setPalavras(p => p.map((w, i) => (i === editingWordIndex ? t : w)));
      setEditingWordIndex(null);
    } else {
      setPalavras(p => [...p, t]);
    }
    setWord('');
  };

  const editWord = (index: number) => {
    setWord(palavras[index]);
    setEditingWordIndex(index);
  };

  const removeWord = (index: number) => {
    setPalavras(p => p.filter((_, i) => i !== index));
    if (editingWordIndex === index) setEditingWordIndex(null);
  };

  // Salvar categoria
  const save = async () => {
    if (!nome.trim() || palavras.length === 0) {
      Alert.alert('Erro', 'Nome e pelo menos 1 palavra são obrigatórios.');
      return;
    }
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      if (editingId) {
        const updated = parsed.map((c: any) =>
          c.id === editingId ? { ...c, nome: nome.trim(), palavras } : c
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        const id = Date.now();
        parsed.push({ id, nome: nome.trim(), palavras });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }

      router.replace('/categorias');
    } catch (e) {
      console.warn(e);
      Alert.alert('Erro', 'Não foi possível salvar.');
    }
  };

  // Exportar categoria atual
  const exportCategory = async () => {
    if (!nome || palavras.length === 0) return;
    const json = JSON.stringify([{ id: editingId ?? Date.now(), nome, palavras }], null, 2);
    await Clipboard.setStringAsync(json);
    Alert.alert('Exportado', 'A categoria foi copiada para a área de transferência!');
  };

  // Importar categorias JSON
  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error('JSON inválido');
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];

      parsed.forEach((cat: any) => {
        const match = existing.find((e: any) => e.nome === cat.nome);
        if (match) {
          // Mesclar palavras sem duplicatas
          match.palavras = Array.from(new Set([...match.palavras, ...cat.palavras]));
        } else {
          // Garantir ID único
          const idExists = existing.some((e: any) => e.id === cat.id);
          if (idExists) cat.id = Date.now() + Math.floor(Math.random() * 1000);
          existing.push(cat);
        }
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setImportModalVisible(false);
      setImportText('');
      Alert.alert('Importação concluída');
      router.replace('/categorias');
    } catch (e) {
      Alert.alert('Erro', 'JSON inválido');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editingId ? 'Editar Categoria' : 'Criar Categoria'}</Text>

      <TextInput
        placeholder="Nome da categoria"
        placeholderTextColor="#9fb4d9"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          placeholder="Palavra"
          placeholderTextColor="#9fb4d9"
          value={word}
          onChangeText={setWord}
          style={[styles.input, { flex: 1 }]}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addOrUpdateWord}>
          <Text style={{ color: 'white' }}>{editingWordIndex !== null ? '✎' : '+'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={palavras}
        keyExtractor={(item, idx) => String(idx)}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <TouchableOpacity onPress={() => editWord(index)}>
              <Text style={{ color: COLORS.text }}>• {item}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeWord(index)}>
              <Text style={{ color: '#e63946', fontWeight: '700' }}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={{ color: 'white' }}>{editingId ? 'Atualizar' : 'Salvar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={exportCategory}>
          <Text style={{ color: 'white' }}>Exportar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={() => setImportModalVisible(true)}>
          <Text style={{ color: 'white' }}>Importar</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de importação */}
      <Modal visible={importModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cole o JSON das categorias</Text>
          <TextInput
            style={styles.modalInput}
            multiline
            value={importText}
            onChangeText={setImportText}
            placeholder="Cole o JSON aqui..."
            placeholderTextColor="#888"
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={styles.modalBtn} onPress={() => setImportModalVisible(false)}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={handleImport}>
              <Text style={styles.btnText}>Importar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: COLORS.bg },
  title: { color: COLORS.text, fontSize: 20, marginBottom: 12 },
  input: {
    backgroundColor: '#0f1724',
    color: COLORS.text,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: '#203a66',
    borderWidth: 1
  },
  addBtn: { backgroundColor: COLORS.accent, padding: 10, borderRadius: 8, justifyContent: 'center' },
  saveBtn: { backgroundColor: COLORS.accent, padding: 12, borderRadius: 10, flex: 1, alignItems: 'center' },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000c',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalTitle: { color: '#fff', fontSize: 20, marginBottom: 12 },
  modalInput: { backgroundColor: '#0f1724', color: '#fff', width: '100%', height: 200, borderRadius: 8, padding: 10, marginBottom: 12 },
  modalBtn: { backgroundColor: '#2a9d8f', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});