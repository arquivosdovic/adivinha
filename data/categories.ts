export type Category = {
  id: number;
  nome: string;
  palavras: string[];
};

export const INITIAL_CATEGORIES = [
  {
    id: 1,
    nome: "Filmes famosos",
    palavras: [
      "Titanic", "Avatar", "O Rei Leão", "Harry Potter", "Homem-Aranha",
      "Vingadores", "Jurassic Park", "Matrix", "Star Wars", "Frozen",
      "Toy Story", "Pantera Negra", "Homem de Ferro", "Batman", "Superman",
      "Procurando Nemo", "Shrek", "O Senhor dos Anéis", "Homem-Formiga", "O Incrível Hulk",
      "Os Incríveis", "Homem de Ferro 3", "Capitão América", "Guardiões da Galáxia", "Homem-Aranha: Sem Volta para Casa",
      "O Diabo Veste Prada", "Crepúsculo", "Jogos Vorazes", "O Rei do Show", "A Bela e a Fera",
      "O Mágico de Oz", "Divertida Mente", "Viva – A Vida é uma Festa", "Os Caça-Fantasmas", "A Origem",
      "Piratas do Caribe", "O Lobo de Wall Street", "Coringa", "Velozes e Furiosos", "Minions",
      "Meu Malvado Favorito", "Os Caça-Fantasmas", "Interestelar", "O Poderoso Chefão", "Gladiador",
      "Forrest Gump", "Homem de Ferro 2", "A Era do Gelo", "O Som do Silêncio", "Encanto"
    ]
  },
  {
    id: 2,
    nome: "Animais",
    palavras: [
      "Leão", "Tigre", "Elefante", "Girafa", "Zebra", "Cachorro", "Gato", "Golfinho", "Baleia", "Tubarão",
      "Macaco", "Panda", "Urso", "Raposa", "Coelho", "Lobo", "Cavalo", "Camelo", "Pinguim", "Coruja",
      "Papagaio", "Águia", "Crocodilo", "Jacaré", "Rinoceronte", "Hipopótamo", "Canguru", "Tartaruga", "Peixe-palhaço", "Galo",
      "Galinha", "Porco", "Ovelha", "Vaca", "Boi", "Touro", "Cabra", "Rato", "Hamster", "Pato",
      "Pavão", "Lêmure", "Foca", "Lobo-marinho", "Ganso", "Periquito", "Tatu", "Tamanduá", "Guepardo", "Bicho-preguiça"
    ]
  },
  {
    id: 3,
    nome: "Comidas",
    palavras: [
      "Pizza", "Hambúrguer", "Sushi", "Batata frita", "Lasanha", "Churrasco", "Feijoada", "Coxinha", "Pastel", "Brigadeiro",
      "Pão de queijo", "Panqueca", "Arroz", "Feijão", "Macarrão", "Bolo de chocolate", "Sorvete", "Pudim", "Tapioca", "Empada",
      "Torta de limão", "Hot dog", "Sanduíche", "Café", "Chá", "Refrigerante", "Suco natural", "Salada", "Omelete", "Panetone",
      "Chocolate", "Queijo", "Presunto", "Peixe assado", "Frango grelhado", "Bife", "Carne moída", "Farofa", "Vinagrete", "Guacamole",
      "Donuts", "Cookie", "Brownie", "Mousse", "Crepe", "Risoto", "Pizza doce", "Milkshake", "Açaí", "Gelatina"
    ]
  },
  {
    id: 4,
    nome: "Celebridades",
    palavras: [
      "Taylor Swift", "Beyoncé", "Rihanna", "Lady Gaga", "Selena Gomez", "Shakira", "Anitta", "Britney Spears", "Ariana Grande", "Dua Lipa",
      "Katy Perry", "Justin Bieber", "Harry Styles", "Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Angelina Jolie", "Emma Watson", "Robert Downey Jr.", "Chris Hemsworth",
      "Chris Evans", "Zendaya", "Timothée Chalamet", "Margot Robbie", "Jennifer Lawrence", "BTS", "Billie Eilish", "Ed Sheeran", "Post Malone", "Drake",
      "Kanye West", "Kim Kardashian", "Kendall Jenner", "Gisele Bündchen", "Neymar", "Cristiano Ronaldo", "Lionel Messi", "Oprah Winfrey", "Will Smith", "Keanu Reeves",
      "Johnny Depp", "Anne Hathaway", "Tom Holland", "Florence Pugh", "Pedro Pascal", "Millie Bobby Brown", "Jennifer Lopez", "Dwayne Johnson", "Shawn Mendes", "Olivia Rodrigo"
    ]
  },
  {
    id: 5,
    nome: "Desenhos e animações",
    palavras: [
      "Bob Esponja", "Os Simpsons", "Tom e Jerry", "Scooby-Doo", "Pokémon", "Digimon", "Dragon Ball", "Naruto", "One Piece", "Sailor Moon",
      "Os Padrinhos Mágicos", "Hora de Aventura", "Ben 10", "Os Jovens Titãs", "Peppa Pig", "Frozen", "Moana", "Encanto", "Zootopia", "Divertida Mente",
      "Toy Story", "Carros", "Os Incríveis", "Procurando Nemo", "Up – Altas Aventuras", "Wall-E", "Ratatouille", "A Bela e a Fera", "Mulan", "A Pequena Sereia",
      "Shrek", "Kung Fu Panda", "Madagascar", "Megamente", "Rio", "Vida de Inseto", "Monstros S.A.", "Coraline", "Lilo & Stitch", "Irmão Urso",
      "Os Flintstones", "Os Jetsons", "Pica-Pau", "Pateta", "Mickey Mouse", "Donald", "Tico e Teco", "He-Man", "Caverna do Dragão", "Avatar: A Lenda de Aang"
    ]
  },
  {
    id: 6,
    nome: "Séries e TV",
    palavras: [
      "Friends", "The Office", "Breaking Bad", "Game of Thrones", "Grey’s Anatomy", "Stranger Things", "Brooklyn Nine-Nine", "The Big Bang Theory", "How I Met Your Mother", "Lost",
      "House", "Glee", "Supernatural", "Vikings", "Lucifer", "The Witcher", "The Mandalorian", "Euphoria", "Bridgerton", "Suits",
      "Modern Family", "Desperate Housewives", "Malcolm", "Prison Break", "Peaky Blinders", "The Boys", "Smallville", "WandaVision", "Loki", "The Last of Us",
      "Narcos", "Elite", "La Casa de Papel", "The Crown", "Dark", "Cobra Kai", "Sex Education", "Emily in Paris", "Outer Banks", "Gilmore Girls",
      "Hannah Montana", "iCarly", "Drake e Josh", "Todo Mundo Odeia o Chris", "Chaves", "Chapolin", "The Walking Dead", "House of the Dragon", "This Is Us", "The Bear"
    ]
  },
  {
    id: 7,
    nome: "Profissões",
    palavras: [
      "Médico", "Professor", "Engenheiro", "Advogado", "Arquiteto", "Enfermeiro", "Policial", "Bombeiro", "Cozinheiro", "Garçom",
      "Motorista", "Cantor", "Ator", "Dançarino", "Fotógrafo", "Programador", "Designer", "Jornalista", "Piloto", "Dentista",
      "Psicólogo", "Veterinário", "Padeiro", "Carpinteiro", "Pedreiro", "Mecânico", "Eletricista", "Costureira", "Estilista", "Maquiador",
      "Modelo", "Cientista", "Astronauta", "Juiz", "Bancário", "Caixa", "Secretário", "Guia turístico", "Barbeiro", "Cabeleireiro",
      "Farmacêutico", "Produtor musical", "Chef", "Editor de vídeo", "Youtuber", "Streamer", "DJ", "Marceneiro", "Agricultor", "Tatuador"
    ]
  },
  {
    id: 8,
    nome: "Países e lugares",
    palavras: [
      "Brasil", "Argentina", "Chile", "Estados Unidos", "Canadá", "México", "França", "Itália", "Espanha", "Portugal",
      "Inglaterra", "Alemanha", "Japão", "China", "Coreia do Sul", "Austrália", "Nova Zelândia", "Egito", "Índia", "Grécia",
      "Holanda", "Suécia", "Noruega", "Finlândia", "Rússia", "Turquia", "África do Sul", "Marrocos", "Peru", "Colômbia",
      "Cuba", "Venezuela", "Uruguai", "Paraguai", "Bolívia", "Suíça", "Áustria", "Dinamarca", "Bélgica", "Irlanda",
      "Escócia", "Tailândia", "Indonésia", "Filipinas", "Havaí", "Bahamas", "Maldivas", "Dubai", "Los Angeles", "Nova York"
    ]
  },
  {
    id: 9,
    nome: "Objetos do dia a dia",
    palavras: [
      "Celular", "Computador", "Relógio", "Copo", "Caneta", "Lápis", "Borracha", "Chave", "Controle remoto", "Carregador",
      "Fone de ouvido", "Televisão", "Livro", "Caderno", "Mesa", "Cadeira", "Cama", "Travesseiro", "Toalha", "Sabonete",
      "Escova de dentes", "Pente", "Tesoura", "Faca", "Garfo", "Colher", "Panela", "Prato", "Garrafa", "Caixa",
      "Bolsa", "Mochila", "Carteira", "Tênis", "Chinelo", "Camisa", "Calça", "Jaqueta", "Guarda-chuva", "Lâmpada",
      "Abajur", "Ventilador", "Microfone", "Mouse", "Teclado", "Régua", "Grampeador", "Espelho", "Câmera", "Vassoura"
    ]
  },
  {
    id: 10,
    nome: "Esportes e atividades",
    palavras: [
      "Futebol", "Basquete", "Vôlei", "Natação", "Tênis", "Corrida", "Skate", "Surfe", "Ciclismo", "Hipismo",
      "Boxe", "Judô", "Karatê", "Jiu-jitsu", "Capoeira", "Golfe", "Beisebol", "Rúgbi", "Patinação", "Escalada",
      "Trilha", "Caminhada", "Musculação", "Dança", "Yoga", "Pilates", "Crossfit", "Pingue-pongue", "Arco e flecha", "Esgrima",
      "Boliche", "Ginástica", "Slackline", "Escalada indoor", "Mergulho", "Frescobol", "Remo", "Vôlei de praia", "Handebol", "Futebol americano",
      "Parkour", "Canoagem", "Patins", "Snowboard", "Esqui", "Escalada", "Caminhada na praia", "Corrida de rua", "Alongamento", "Ciclismo indoor"
    ]
  }
];
