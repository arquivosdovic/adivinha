import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import CategoryCard from '../../components/CategoryCard';
import { INITIAL_CATEGORIES } from '../../data/categories';
import { COLORS } from '../../styles/theme';

const STORAGE_KEY = 'HU_CUSTOM_CATEGORIES_v1';

export default function Categorias() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const router = useRouter();

  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importText, setImportText] = useState('');

  // Carregar categorias customizadas
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setCategories([...INITIAL_CATEGORIES, ...parsed]);
        }
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  // Remover categoria custom
  const removeCategory = (id: number) => {
    Alert.alert('Confirmar', 'Deseja realmente excluir essa categoria?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          const parsed = raw ? JSON.parse(raw) : [];
          const filtered = parsed.filter((c: any) => c.id !== id);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
          setCategories([...INITIAL_CATEGORIES, ...filtered]);
      }}
    ]);
  };

  // Editar categoria custom
  const editCategory = (id: number) => {
    router.push(`/categorias/criar?id=${id}`);
  };

  // Exportar categorias (individual ou todas) para área de transferência
  const exportCategory = async (id?: number) => {
    let toExport;
    if (id) {
      const cat = categories.find(c => c.id === id);
      if (!cat) return;
      toExport = [cat];
    } else {
      const raw = categories.filter(c => c.id > 1000); // apenas custom
      toExport = raw;
    }
    try {
      await Clipboard.setStringAsync(JSON.stringify(toExport, null, 2));
      Alert.alert('Exportado', 'Categorias copiadas para a área de transferência!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível copiar para a área de transferência.');
    }
  };

  // Importar categorias
  const handleImport = async () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) throw new Error('JSON inválido');

      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : [];

      // Mesclar categorias importadas
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
      setCategories([...INITIAL_CATEGORIES, ...existing]);
      setImportModalVisible(false);
      setImportText('');
      Alert.alert('Importação concluída');
    } catch (e) {
      Alert.alert('Erro', 'JSON inválido');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorias</Text>

      <FlatList 
        data={categories} 
        keyExtractor={(i) => String(i.id)} 
        renderItem={({ item }) => {
          const isCustom = item.id > 1000;
          return (
            <View style={{ marginBottom: 8 }}>
              <CategoryCard 
                title={item.nome} 
                count={item.palavras.length} 
                onPress={() => router.push(`/jogo/${item.id}`)} 
              />
              {isCustom && (
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => editCategory(item.id)}>
                    <Text style={styles.btnText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => removeCategory(item.id)}>
                    <Text style={styles.btnText}>Excluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.exportBtn} onPress={() => exportCategory(item.id)}>
                    <Text style={styles.btnText}>Exportar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }} 
      />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => router.replace('/')}>
          <Text style={styles.menuBtnText}>Menu Inicial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={() => exportCategory()}>
          <Text style={styles.menuBtnText}>Exportar Todas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setImportModalVisible(true)}>
          <Text style={styles.menuBtnText}>Importar</Text>
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
  title: { color: COLORS.text, fontSize: 22, marginBottom: 8 },
  menuBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center'
  },
  menuBtnText: {
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 16
  },
  editBtn: {
    backgroundColor: '#2a9d8f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  deleteBtn: {
    backgroundColor: '#e63946',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  exportBtn: {
    backgroundColor: '#f4a261',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
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
});