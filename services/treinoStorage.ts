
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Treino, treinos } from "../data/treinos";

const CHAVE_TREINOS = "@trainlog:treinos";

export async function buscarTreinos(): Promise<Treino[]> {
  const dados = await AsyncStorage.getItem(CHAVE_TREINOS);

  if (dados !== null) {
    return JSON.parse(dados) as Treino[];
  }

  // Na primeira utilização, carrega os treinos de exemplo
  await AsyncStorage.setItem(
    CHAVE_TREINOS,
    JSON.stringify(treinos)
  );

  return treinos;
}

export async function salvarTreino(
  novoTreino: Treino
): Promise<void> {
  const listaAtual = await buscarTreinos();

  const listaAtualizada = [...listaAtual, novoTreino];

  await AsyncStorage.setItem(
    CHAVE_TREINOS,
    JSON.stringify(listaAtualizada)
  );
}

export async function excluirTreino(id: string): Promise<void> {
  const listaAtual = await buscarTreinos();

  const listaAtualizada = listaAtual.filter(
    (treino) => treino.id !== id
  );

  await AsyncStorage.setItem(
    CHAVE_TREINOS,
    JSON.stringify(listaAtualizada)
  );
}

export async function atualizarTreino(
  treinoAtualizado: Treino
): Promise<void> {
  const listaAtual = await buscarTreinos();

  const listaAtualizada = listaAtual.map((treino) =>
    treino.id === treinoAtualizado.id
      ? treinoAtualizado
      : treino
  );

  await AsyncStorage.setItem(
    CHAVE_TREINOS,
    JSON.stringify(listaAtualizada)
  );
}

