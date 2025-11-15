// App.js - Expo React Native app para jogo no estilo "Heads Up!"
// Instruções de execução:
// 1. No seu projeto Expo (ou crie com `npx create-expo-app HeadsUpApp`) copie este arquivo como App.js
// 2. Instale dependências:
//    expo install expo-sensors @react-native-async-storage/async-storage
// 3. Rode `npx expo start` e abra no Expo Go

import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceMotion } from 'expo-sensors';

// --- Dados iniciais fornecidos pelo usuário (strings normalizadas) ---
const INITIAL_CATEGORIES = [
  {
    id: 1,
    nome: 'Filmes famosos',
    palavras: [
      'Titanic','Avatar','O Rei Leao','Harry Potter','Homem-Aranha','Vingadores','Jurassic Park','Matrix','Star Wars','Frozen',
      'Toy Story','Pantera Negra','Homem de Ferro','Batman','Superman','Procurando Nemo','Shrek','O Senhor dos Aneis','Homem-Formiga','O Incrivel Hulk',
      'Os Incriveis','Homem de Ferro 3','Capitao America','Guardiões da Galaxia','Homem-Aranha: Sem Volta para Casa','O Diabo Veste Prada','Crepusculo','Jogos Vorazes','O Rei do Show','A Bela e a Fera',
      'O Magico de Oz','Divertida Mente','Viva - A Vida e uma Festa','Os Caca-Fantasmas','A Origem','Piratas do Caribe','O Lobo de Wall Street','Coringa','Velozes e Furiosos','Minions',
      'Meu Malvado Favorito','Interestelar','O Poderoso Chefao','Gladiador','Forrest Gump','Homem de Ferro 2','A Era do Gelo','O Som do Silencio','Encanto','Cinema Clasico'
    ]
  },
  {
    id: 2,
    nome: 'Animais',
    palavras: [
      'Leao','Tigre','Elefante','Girafa','Zebra','Cachorro','Gato','Golfinho','Baleia','Tubarao',
      'Macaco','Panda','Urso','Raposa','Coelho','Lobo','Cavalo','Camelo','Pinguim','Coruja',
      'Papagaio','Aguia','Crocodilo','Jacare','Rinoceronte','Hippopotamo','Canguru','Tartaruga','Peixe-palhaco','Galo',
      'Galinha','Porco','Ovelha','Vaca','Boi','Touro','Cabra','Rato','Hamster','Pato',
      'Pavao','Lemure','Foca','Lobo-marinho','Ganso','Periquito','Tatu','Tamandua','Guepardo','Bicho-preguica'
    ]
  },
  {
    id: 3,
    nome: 'Comidas',
    palavras: [
      'Pizza','Hamburguer','Sushi','Batata frita','Lasanha','Churrasco','Feijoada','Coxinha','Pastel','Brigadeiro',
      'Pao de queijo','Panqueca','Arroz','Feijao','Macarrao','Bolo de chocolate','Sorvete','Pudim','Tapioca','Empada',
      'Torta de limao','Hot dog','Sanduiche','Cafe','Cha','Refrigerante','Suco natural','Salada','Omelete','Panetone',
      'Chocolate','Queijo','Presunto','Peixe assado','Frango grelhado','Bife','Carne moida','Farofa','Vinagrete','Guacamole',
      'Donuts','Cookie','Brownie','Mousse','Crepe','Risoto','Pizza doce','Milkshake','Acai','Prato tipico'
    ]
  },
  {
    id: 4,
    nome: 'Celebridades',
    palavras: [
      'Taylor Swift','Beyonce','Rihanna','Lady Gaga','Selena Gomez','Shakira','Anitta','Britney Spears','Ariana Grande','Dua Lipa',
      'Katy Perry','Justin Bieber','Harry Styles','Leonardo DiCaprio','Brad Pitt','Tom Cruise','Angelina Jolie','Emma Watson','Robert Downey Jr.','Chris Hemsworth',
      'Chris Evans','Zendaya','Timothee Chalamet','Margot Robbie','Jennifer Lawrence','BTS','Billie Eilish','Ed Sheeran','Post Malone','Drake',
      'Kanye West','Kim Kardashian','Kendall Jenner','Gisele Bundchen','Neymar','Cristiano Ronaldo','Lionel Messi','Oprah Winfrey','Will Smith','Keanu Reeves',
      'Johnny Depp','Anne Hathaway','Tom Holland','Florence Pugh','Pedro Pascal','Millie Bobby Brown','Jennifer Lopez','Dwayne Johnson','Shawn Mendes','Ator Famoso'
    ]
  },
  {
    id: 5,
    nome: 'Desenhos e animacoes',
    palavras: [
      'Bob Esponja','Os Simpsons','Tom e Jerry','Scooby-Doo','Pokemon','Digimon','Dragon Ball','Naruto','One Piece','Sailor Moon',
      'Os Padrinhos Magicos','Hora de Aventura','Ben 10','Os Jovens Titas','Peppa Pig','Frozen','Moana','Encanto','Zootopia','Divertida Mente',
      'Toy Story','Carros','Os Incriveis','Procurando Nemo','Up - Altas Aventuras','Wall-E','Ratatouille','A Bela e a Fera','Mulan','A Pequena Sereia',
      'Shrek','Kung Fu Panda','Madagascar','Megamente','Rio','Vida de Inseto','Monstros SA','Coraline','Lilo & Stitch','Irmao Urso',
      'Os Flintstones','Os Jetsons','Pica-Pau','Pateta','Mickey Mouse','Donald','Tico e Teco','He-Man','Caverna do Dragao','Avatar: A Lenda de Aang'
    ]
  },
  {
    id: 6,
    nome: 'Series e TV',
    palavras: [
      'Friends','The Office','Breaking Bad','Game of Thrones','Greys Anatomy','Stranger Things','Brooklyn Nine-Nine','The Big Bang Theory','How I Met Your Mother','Lost',
      'House','Glee','Supernatural','Vikings','Lucifer','The Witcher','The Mandalorian','Euphoria','Bridgerton','Suits',
      'Modern Family','Desperate Housewives','Malcolm','Prison Break','Peaky Blinders','The Boys','Smallville','WandaVision','Loki','The Last of Us',
      'Narcos','Elite','La Casa de Papel','The Crown','Dark','Cobra Kai','Sex Education','Emily in Paris','Outer Banks','Gilmore Girls',
      'Hannah Montana','iCarly','Drake e Josh','Todo Mundo Odeia o Chris','Chaves','Chapolin','The Walking Dead','House of the Dragon','This Is Us','The Bear'
    ]
  },
  {
    id: 7,
    nome: 'Profissoes',
    palavras: [
      'Medico','Professor','Engenheiro','Advogado','Arquiteto','Enfermeiro','Policial','Bombeiro','Cozinheiro','Garcom',
      'Motorista','Cantor','Ator','Dancarino','Fotografo','Programador','Designer','Jornalista','Piloto','Dentista',
      'Psicologo','Veterinario','Padeiro','Carpinteiro','Pedreiro','Mecanico','Eletricista','Costureira','Estilista','Maquiador',
      'Modelo','Cientista','Astronauta','Juiz','Bancario','Caixa','Secretario','Guia turistico','Barbeiro','Cabeleireiro',
      'Farmaceutico','Produtor musical','Chef','Editor de video','Youtuber','Streamer','DJ','Marceneiro','Agricultor','Tatuador'
    ]
  },
  {
    id: 8,
    nome: 'Paises e lugares',
    palavras: [
      'Brasil','Argentina','Chile','Estados Unidos','Canada','Mexico','Franca','Italia','Espanha','Portugal',
      'Inglaterra','Alemanha','Japao','China','Coreia do Sul','Australia','Nova Zelandia','Egito','India','Grecia',
      'Holanda','Suecia','Noruega','Finlandia','Rússia','Turquia','Africa do Sul','Marrocos','Peru','Colombia',
      'Cuba','Venezuela','Uruguai','Paraguai','Bolivia','Suica','Austria','Dinamarca','Belgica','Irlanda',
      'Escocia','Tailandia','Indonésia','Filipinas','Hawaii','Bahamas','Maldivas','Dubai','Los Angeles','Nova York'
    ].map(s => String(s))
  },
  {
    id: 9,
    nome: 'Objetos do dia a dia',
    palavras: [
      'Celular','Computador','Relogio','Copo','Caneta','Lapís','Borracha','Chave','Controle remoto','Carregador',
      'Fone de ouvido','Televisao','Livro','Caderno','Mesa','Cadeira','Cama','Travesseiro','Toalha','Sabonete',
      'Escova de dentes','Pente','Tessoura','Faca','Garfo','Colher','Panela','Prato','Garrafa','Caixa',
      'Bolsa','Mochila','Carteira','Tenis','Chinelo','Camisa','Calca','Jaqueta','Guarda-chuva','Lampada',
      'Abajur','Ventilador','Microfone','Mouse','Teclado','Regua','Grampeador','Espelho','Camera','Vassoura'
    ]
  },
  {
    id: 10,
    nome: 'Esportes e atividades',
    palavras: [
      'Futebol','Basquete','Volei','Natacao','Tenis','Corrida','Skate','Surfe','Ciclismo','Hipismo',
      'Boxe','Judo','Karate','Jiu-jitsu','Capoeira','Golfe','Beisebol','Rugbi','Patinacao','Escalada',
      'Trilha','Caminhada','Musculacao','Danca','Yoga','Pilates','Crossfit','Pingue-pongue','Arco e flecha','Esgrima',
      'Boliche','Ginastica','Slackline','Escalada indoor','Mergulho','Frescobol','Remo','Volei de praia','Handebol','Futebol americano',
      'Parkour','Canoagem','Patins','Snowboard','Esqui','Caminhada na praia','Corrida de rua','Alongamento','Atividade fisica','Esporte coletivo'
    ]
  }
];

// --- Utilitários ---
const STORAGE_KEYS = {
  CUSTOM_CATEGORIES: 'HU_CUSTOM_CATEGORIES_v1'
};

function shuffleArray(a) {
  const arr = Array.isArray(a) ? [...a] : [];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Componente principal ---
export default function App() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [selectedCat, setSelectedCat] = useState(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [timePerRound, setTimePerRound] = useState(60); // segundos
  const [modalCreateVisible, setModalCreateVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES);
        if (raw) {
          const saved = JSON.parse(raw);
          if (Array.isArray(saved) && saved.length) {
            // normaliza ids para evitar colisao
            const offset = categories.length;
            const mapped = saved.map((c, idx) => ({ ...c, id: offset + idx + 1 }));
            setCategories(prev => [...prev, ...mapped]);
          }
        }
      } catch (e) {
        console.warn('Erro lendo categorias customizadas', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGame = (cat) => {
    if (!cat) return;
    setSelectedCat(cat);
    setGameRunning(true);
  };

  const saveCustomCategory = async (nome, palavras) => {
    const newCat = { id: categories.length + 1, nome, palavras };
    try {
      const customRaw = (await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CATEGORIES)) || '[]';
      const parsed = JSON.parse(customRaw);
      parsed.push(newCat);
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CATEGORIES, JSON.stringify(parsed));
      setCategories(prev => [...prev, newCat]);
      setModalCreateVisible(false);
    } catch (e) {
      console.warn('Erro salvando categoria customizada', e);
      Alert.alert('Erro', 'Nao foi possivel salvar categoria.');
    }
  };

  return (
    <View style={styles.container}>
      {!gameRunning ? (
        <View style={styles.screen}>
          <Text style={styles.title}>Heads Up — Versao Local</Text>
          <Text style={styles.subtitle}>Escolha uma categoria</Text>

          <FlatList
            data={categories}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.catButton} onPress={() => startGame(item)}>
                <Text style={styles.catButtonText}>{item.nome}</Text>
                <Text style={styles.catCount}>{Array.isArray(item.palavras) ? item.palavras.length : 0} palavras</Text>
              </TouchableOpacity>
            )}
          />

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <TouchableOpacity style={styles.smallButton} onPress={() => setModalCreateVisible(true)}>
              <Text style={styles.smallButtonText}>Criar categoria</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallButton} onPress={() => {
              Alert.alert('Tempo', 'Escolha tempo por jogador', [
                { text: '30s', onPress: () => setTimePerRound(30) },
                { text: '45s', onPress: () => setTimePerRound(45) },
                { text: '60s', onPress: () => setTimePerRound(60) },
                { text: '90s', onPress: () => setTimePerRound(90) },
              ]);
            }}>
              <Text style={styles.smallButtonText}>Tempo: {timePerRound}s</Text>
            </TouchableOpacity>
          </View>

        </View>
      ) : (
        <GameScreen
          category={selectedCat}
          onExit={() => { setGameRunning(false); setSelectedCat(null); }}
          timeLimit={timePerRound}
        />
      )}

      <CreateCategoryModal
        visible={modalCreateVisible}
        onClose={() => setModalCreateVisible(false)}
        onSave={saveCustomCategory}
      />
    </View>
  );
}

// --- Modal para criar categoria customizada ---
function CreateCategoryModal({ visible, onClose, onSave }) {
  const [nome, setNome] = useState('');
  const [palavraText, setPalavraText] = useState('');
  const [palavras, setPalavras] = useState([]);

  useEffect(() => {
    if (!visible) {
      setNome(''); setPalavraText(''); setPalavras([]);
    }
  }, [visible]);

  const addPalavra = () => {
    const t = palavraText.trim();
    if (!t) return;
    setPalavras(prev => [...prev, t]);
    setPalavraText('');
  };

  const handleSave = () => {
    if (!nome.trim() || palavras.length < 1) {
      Alert.alert('Erro', 'De um nome e adicione pelo menos 1 palavra');
      return;
    }
    onSave(nome.trim(), palavras);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Criar Categoria</Text>
        <TextInput placeholder="Nome da categoria" value={nome} onChangeText={setNome} style={styles.input} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput placeholder="Adicionar palavra" value={palavraText} onChangeText={setPalavraText} style={[styles.input, { flex: 1 }]} />
          <TouchableOpacity style={styles.addButton} onPress={addPalavra}><Text style={styles.addButtonText}>+</Text></TouchableOpacity>
        </View>
        <FlatList data={palavras} keyExtractor={(item, idx) => String(idx)} renderItem={({ item }) => <Text style={styles.wordItem}>• {item}</Text>} />
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <TouchableOpacity style={styles.smallButton} onPress={handleSave}><Text style={styles.smallButtonText}>Salvar</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#7a7a7a' }]} onPress={onClose}><Text style={styles.smallButtonText}>Cancelar</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// --- Tela de jogo ---
function GameScreen({ category, onExit, timeLimit }) {
  const [queue, setQueue] = useState([]); // palavras ainda a jogar (fila)
  const [current, setCurrent] = useState(null);
  const [skipped, setSkipped] = useState([]); // palavras que foram puladas nessa vez
  const [used, setUsed] = useState(new Set()); // palavras acertadas nessa vez
  const [secondsLeft, setSecondsLeft] = useState(timeLimit || 60);
  const [running, setRunning] = useState(true);
  const motionSub = useRef(null);
  const tiltState = useRef({ lastAction: null });

  useEffect(() => {
    if (!category || !Array.isArray(category.palavras)) return;

    // inicializa fila embaralhada
    const shuffled = shuffleArray(category.palavras);
    setQueue(shuffled);
    setCurrent(shuffled[0] ?? null);
    setSkipped([]);
    setUsed(new Set());
    setSecondsLeft(timeLimit || 60);
    setRunning(true);

    DeviceMotion.setUpdateInterval(150);
    const sub = DeviceMotion.addListener((dm) => {
      try {
        const rot = dm.rotation || dm.rotationRate || dm;
        const beta = (rot && (rot.beta ?? rot[1])) ?? 0; // pitch
        // thresholds ajustaveis
        if (beta < -0.6 && tiltState.current.lastAction !== 'up') {
          tiltState.current.lastAction = 'up';
          handleSkip();
        } else if (beta > 0.6 && tiltState.current.lastAction !== 'down') {
          tiltState.current.lastAction = 'down';
          handleCorrect();
        }
        if (Math.abs(beta) < 0.3) tiltState.current.lastAction = null;
      } catch (e) {
        // ignore
      }
    });
    motionSub.current = sub;

    return () => {
      if (motionSub.current && typeof motionSub.current.remove === 'function') {
        motionSub.current.remove();
      } else if (typeof sub.remove === 'function') {
        sub.remove();
      }
      motionSub.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, timeLimit]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          endRound();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const handleCorrect = () => {
    if (!current) return;
    setUsed(prev => new Set(prev).add(current));

    setQueue(prev => {
      const [, ...rest] = prev;
      if (rest.length === 0) {
        if (skipped.length > 0) {
          // re-enfileira as puladas
          const next = shuffleArray(skipped);
          setSkipped([]);
          setCurrent(next[0] ?? null);
          return next;
        } else {
          endRound(true);
          return [];
        }
      }
      setCurrent(rest[0]);
      return rest;
    });
  };

  const handleSkip = () => {
    if (!current) return;
    setSkipped(prev => [...prev, current]);
    setQueue(prev => {
      const [, ...rest] = prev;
      if (rest.length === 0) {
        const nextQueue = skipped.length > 0 ? shuffleArray(skipped) : [];
        setSkipped([]);
        setCurrent(nextQueue[0] ?? null);
        return nextQueue;
      }
      setCurrent(rest[0]);
      return rest;
    });
  };

  const endRound = (allUsed = false) => {
    setRunning(false);
    if (motionSub.current && typeof motionSub.current.remove === 'function') motionSub.current.remove();
    const acertadas = used ? Array.from(used).length : 0;
    Alert.alert('Fim da rodada', allUsed ? 'Você acertou toda a categoria!' : `Tempo esgotado! Acertou ${acertadas} palavras.`, [
      { text: 'OK', onPress: onExit }
    ]);
  };

  if (!category) {
    return (
      <View style={styles.screen}><Text style={styles.title}>Categoria inválida</Text></View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.timer}>Tempo: {secondsLeft}s</Text>
      <Text style={styles.catTitle}>{category.nome}</Text>

      <View style={styles.card}>
        <Text style={styles.word}>{current ?? '—'}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#2b6cb0' }]} onPress={handleCorrect}><Text style={styles.controlText}>Acertou</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#6b7280' }]} onPress={handleSkip}><Text style={styles.controlText}>Pular</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#4b5563' }]} onPress={() => { setRunning(false); onExit(); }}><Text style={styles.controlText}>Sair</Text></TouchableOpacity>
      </View>

      <Text style={styles.smallInfo}>Dica: coloque o celular na testa com a tela virada para o time. Incline para baixo para pular, para cima para confirmar (pode variar entre dispositivos — ajuste limiares se necessario).</Text>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220', // fundo mais escuro
    padding: 18,
    paddingTop: 48
  },
  screen: { flex: 1 },
  title: { fontSize: 26, color: '#dbeafe', fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#cbd5e1', marginBottom: 12 },
  catButton: { backgroundColor: '#07102a', padding: 12, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catButtonText: { color: '#e6f0ff', fontSize: 16 },
  catCount: { color: '#9fb4d9' },
  smallButton: { backgroundColor: '#1f4f8a', padding: 10, borderRadius: 10, marginRight: 8 },
  smallButtonText: { color: '#e6f0ff' },
  modalContainer: { flex: 1, backgroundColor: '#071226', padding: 18, paddingTop: 48 },
  modalTitle: { color: '#e6f0ff', fontSize: 20, marginBottom: 12 },
  input: { backgroundColor: '#0f1724', color: '#e6f0ff', padding: 10, borderRadius: 8, marginBottom: 8, borderColor: '#203a66', borderWidth: 1 },
  addButton: { backgroundColor: '#2563eb', padding: 10, borderRadius: 8, justifyContent: 'center' },
  addButtonText: { color: 'white', fontSize: 18 },
  wordItem: { color: '#cbd5e1', paddingVertical: 4 },
  timer: { color: '#bfdbfe', fontSize: 18, textAlign: 'center' },
  catTitle: { color: '#e6f0ff', fontSize: 20, marginTop: 12, textAlign: 'center' },
  card: { backgroundColor: '#0f1724', borderRadius: 12, padding: 24, marginVertical: 18, alignItems: 'center', justifyContent: 'center' },
  word: { color: '#e6f0ff', fontSize: 28, fontWeight: '700' },
  controlButton: { padding: 12, borderRadius: 10 },
  controlText: { color: 'white' },
  smallInfo: { color: '#94a3b8', marginTop: 12 }
});
