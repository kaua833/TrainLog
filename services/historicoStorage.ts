
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RegistroTreino = {
  id: string;
  treinoId: string;
  nomeTreino: string;
  grupo: string;
  data: string;
  quantidadeExercicios: number;
};

const CHAVE_HISTORICO = "@trainlog:historico";

// Buscar os treinos realizados
export async function buscarHistorico(): Promise<RegistroTreino[]> {
  const dados = await AsyncStorage.getItem(CHAVE_HISTORICO);

  if (dados !== null) {
    return JSON.parse(dados) as RegistroTreino[];
  }

  return [];
}

// Registrar um treino realizado
export async function registrarTreino(
  registro: RegistroTreino
): Promise<void> {
  const historicoAtual = await buscarHistorico();

  const historicoAtualizado = [
    registro,
    ...historicoAtual,
  ];

  await AsyncStorage.setItem(
    CHAVE_HISTORICO,
    JSON.stringify(historicoAtualizado)
  );
}

export async function excluirRegistro(
  id: string
): Promise<void> {
  const historicoAtual = await buscarHistorico();

  const historicoAtualizado = historicoAtual.filter(
    (registro) => registro.id !== id
  );

  await AsyncStorage.setItem(
    CHAVE_HISTORICO,
    JSON.stringify(historicoAtualizado)
  );
}
