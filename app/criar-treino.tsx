import { useRouter } from "expo-router";
import { salvarTreino } from "../services/treinoStorage";
import { Treino } from "../data/treinos";
import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert, } from "react-native";
import BotaoPersonalizado from "../components/BotaoPersonalizado";

type Exercicio = {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
};

export default function CriarTreinoScreen() {
  const [nome, setNome] = useState("");
  const [grupo, setGrupo] = useState("");

  const [nomeExercicio, setNomeExercicio] = useState("");
  const [series, setSeries] = useState("");
  const [repeticoes, setRepeticoes] = useState("");

  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const router = useRouter();

  function adicionarExercicio() {
    if (
      !nomeExercicio.trim() ||
      !series.trim() ||
      !repeticoes.trim()
    ) {
      Alert.alert("Atenção", "Preencha todos os campos do exercício.");
      return;
    }

    const quantidadeSeries = Number(series);

    if (!Number.isInteger(quantidadeSeries) || quantidadeSeries <= 0) {
      Alert.alert("Atenção", "Informe uma quantidade válida de séries.");
      return;
    }

    const novoExercicio: Exercicio = {
      id: Date.now().toString() + Math.random().toString(),
      nome: nomeExercicio.trim(),
      series: quantidadeSeries,
      repeticoes: repeticoes.trim(),
    };

    setExercicios((anteriores) => [...anteriores, novoExercicio]);

    setNomeExercicio("");
    setSeries("");
    setRepeticoes("");
    }

  
  async function finalizarCadastro() {
        if (!nome.trim() || !grupo.trim()) {
            Alert.alert(
             "Atenção",
             "Preencha o nome e o grupo muscular."
        );
        return;
    }

    if (exercicios.length === 0) {
      Alert.alert(
        "Atenção",
        "Adicione pelo menos um exercício."
    );
    return;
    }

  const novoTreino: Treino = {
    id: Date.now().toString(),
    nome: nome.trim(),
    grupo: grupo.trim(),
    exercicios,
  };

  try {
    await salvarTreino(novoTreino);

    router.replace("/treinos");
  } catch (error) {
    console.error("Erro ao salvar treino:", error);

    Alert.alert(
      "Erro",
      "Não foi possível salvar o treino."
    );
  }
}


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Criar Treino</Text>

      <Text style={styles.subtitulo}>
        Monte sua ficha personalizada.
      </Text>

      <Text style={styles.label}>Nome do treino</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Treino D"
        placeholderTextColor="#9ca3af"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Grupo muscular</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Peito e tríceps"
        placeholderTextColor="#9ca3af"
        value={grupo}
        onChangeText={setGrupo}
      />

      <Text style={styles.secao}>Adicionar exercício</Text>

      <Text style={styles.label}>Nome do exercício</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Supino reto"
        placeholderTextColor="#9ca3af"
        value={nomeExercicio}
        onChangeText={setNomeExercicio}
      />

      <Text style={styles.label}>Quantidade de séries</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 3"
        placeholderTextColor="#9ca3af"
        keyboardType="numeric"
        value={series}
        onChangeText={setSeries}
      />

      <Text style={styles.label}>Repetições</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 10 a 12"
        placeholderTextColor="#9ca3af"
        value={repeticoes}
        onChangeText={setRepeticoes}
      />

      <BotaoPersonalizado
        titulo="+ Adicionar exercício"
        tipo="secundario"
        onPress={adicionarExercicio}
      />

      <Text style={styles.secao}>
        Exercícios adicionados ({exercicios.length})
      </Text>

      {exercicios.length === 0 ? (
        <Text style={styles.vazio}>
          Nenhum exercício adicionado ainda.
        </Text>
      ) : (
        exercicios.map((exercicio) => (
          <View key={exercicio.id} style={styles.card}>
            <Text style={styles.nomeExercicio}>
              {exercicio.nome}
            </Text>
            <Text style={styles.info}>
              {exercicio.series} séries
            </Text>
            <Text style={styles.info}>
              {exercicio.repeticoes} repetições
            </Text>
          </View>
        ))
      )}
        
      <BotaoPersonalizado
        titulo="Salvar treino"
        tipo="sucesso"
        onPress={finalizarCadastro}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#60a5fa",
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 15,
    color: "#9ca3af",
    marginTop: 8,
    marginBottom: 20,
  },
  secao: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 30,
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    color: "#ffffff",
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#374151",
  },
  botaoAdicionar: {
    backgroundColor: "#374151",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  botaoFinalizar: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  vazio: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  nomeExercicio: {
    color: "#60a5fa",
    fontSize: 17,
    fontWeight: "bold",
  },
  info: {
    color: "#d1d5db",
    fontSize: 14,
    marginTop: 6,
  },
});
