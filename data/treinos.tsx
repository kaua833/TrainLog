
export type Exercicio = {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
};

export type Treino = {
  id: string;
  nome: string;
  grupo: string;
  exercicios: Exercicio[];
};

export const treinos: Treino[] = [
  {
    id: "1",
    nome: "Treino A",
    grupo: "Peito e tríceps",
    exercicios: [
      { id: "1", nome: "Supino reto", series: 3, repeticoes: "10 a 12" },
      { id: "2", nome: "Supino inclinado", series: 3, repeticoes: "10 a 12" },
      { id: "3", nome: "Crucifixo", series: 3, repeticoes: "12" },
      { id: "4", nome: "Tríceps na polia", series: 3, repeticoes: "12" },
      { id: "5", nome: "Tríceps francês", series: 3, repeticoes: "12" },
      { id: "6", nome: "Tríceps testa", series: 3, repeticoes: "10" },
    ],
  },
  {
    id: "2",
    nome: "Treino B",
    grupo: "Costas e bíceps",
    exercicios: [
      { id: "1", nome: "Puxada frontal", series: 3, repeticoes: "12" },
      { id: "2", nome: "Remada baixa", series: 3, repeticoes: "12" },
      { id: "3", nome: "Remada unilateral", series: 3, repeticoes: "10" },
      { id: "4", nome: "Rosca direta", series: 3, repeticoes: "12" },
      { id: "5", nome: "Rosca alternada", series: 3, repeticoes: "12" },
      { id: "6", nome: "Rosca martelo", series: 3, repeticoes: "10" },
    ],
  },
  {
    id: "3",
    nome: "Treino C",
    grupo: "Pernas e ombros",
    exercicios: [
      { id: "1", nome: "Agachamento", series: 3, repeticoes: "10" },
      { id: "2", nome: "Leg press", series: 3, repeticoes: "12" },
      { id: "3", nome: "Cadeira extensora", series: 3, repeticoes: "12" },
      { id: "4", nome: "Mesa flexora", series: 3, repeticoes: "12" },
      { id: "5", nome: "Elevação lateral", series: 3, repeticoes: "12" },
      { id: "6", nome: "Desenvolvimento", series: 3, repeticoes: "10" },
      { id: "7", nome: "Panturrilha", series: 3, repeticoes: "15" },
    ],
  },
];
