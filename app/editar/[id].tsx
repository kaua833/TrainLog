import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert, } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Treino, Exercicio } from "../../data/treinos";
import { buscarTreinos, atualizarTreino, } from "../../services/treinoStorage";
import { confirmarAcao } from "../../services/alerta";
import BotaoPersonalizado from "../../components/BotaoPersonalizado";

export default function EditarTreinoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [treino, setTreino] = useState<Treino | null>(null);
  const [nome, setNome] = useState("");
  const [grupo, setGrupo] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [nomeExercicio, setNomeExercicio] = useState("");
  const [series, setSeries] = useState("");
  const [repeticoes, setRepeticoes] = useState("");
  const [idExercicioEditando, setIdExercicioEditando] = useState<string | null>(null);

  useEffect(() => {
    async function carregarTreino() {
      try {
        const lista = await buscarTreinos();
        const encontrado = lista.find((item) => item.id === id);

        if (encontrado) {
          setTreino(encontrado);
          setNome(encontrado.nome);
          setGrupo(encontrado.grupo);
          setExercicios(encontrado.exercicios);
        }
      } catch (error) {
        console.error("Erro ao carregar treino:", error);
        Alert.alert("Erro", "Não foi possível carregar o treino.");
      }
    }

    carregarTreino();
  }, [id]);
    
  function removerExercicio(idExercicio: string) {
    confirmarAcao(
      "Remover exercício",
      "Deseja remover este exercício da ficha?",
      () => {
        setExercicios((lista) =>
          lista.filter(
            (item) => item.id !== idExercicio
          )
        );
      }
    );
  }
 
  function iniciarEdicao(exercicio: Exercicio) {
    setIdExercicioEditando(exercicio.id);
    setNomeExercicio(exercicio.nome);
    setSeries(exercicio.series.toString());
    setRepeticoes(exercicio.repeticoes);
  }

  function cancelarEdicao() {
    setIdExercicioEditando(null);
    setNomeExercicio("");
    setSeries("");
    setRepeticoes("");
  }

  function adicionarExercicio() {
    if (
      !nomeExercicio.trim() ||
      !series.trim() ||
      !repeticoes.trim()
    ) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos do exercício."
      );
      return;
    }

    const quantidadeSeries = Number(series);

    if (
      !Number.isInteger(quantidadeSeries) ||
      quantidadeSeries <= 0
    ) {
      Alert.alert(
        "Atenção",
        "Informe uma quantidade válida de séries."
      );
      return;
    }

    if (idExercicioEditando !== null) {
      setExercicios((lista) =>
        lista.map((exercicio) =>
          exercicio.id === idExercicioEditando
            ? {
                ...exercicio,
                nome: nomeExercicio.trim(),
                series: quantidadeSeries,
                repeticoes: repeticoes.trim(),
              }
            : exercicio
         )
        );
      } else {
        const novoExercicio: Exercicio = {
          id: Date.now().toString() + Math.random().toString(),
          nome: nomeExercicio.trim(),
          series: quantidadeSeries,
          repeticoes: repeticoes.trim(),
        };

        setExercicios((lista) => [...lista, novoExercicio]);
      }

      cancelarEdicao();
  }

  async function salvarAlteracoes() {
    if (!treino || salvando) return;

    if (!nome.trim() || !grupo.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
  
    const treinoAtualizado: Treino = {
      ...treino,
        nome: nome.trim(),
        grupo: grupo.trim(),
        exercicios,
    };

    try {
      setSalvando(true);
      await atualizarTreino(treinoAtualizado);
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar treino:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
    }
  }

  if (!treino) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitulo}>
          Carregando treino...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.titulo}>Editar Treino</Text>

      <Text style={styles.subtitulo}>
        Atualize as informações da sua ficha.
      </Text>

      <Text style={styles.label}>Nome do treino</Text>

      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Grupo muscular</Text>

      <TextInput
        style={styles.input}
        value={grupo}
        onChangeText={setGrupo}
        placeholderTextColor="#9ca3af"
      />
      
      <Text style={styles.secao}>Adicionar exercício</Text>

      <Text style={styles.label}>Nome do exercício</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Remada baixa"
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
        titulo={
          idExercicioEditando !== null
            ? "Atualizar exercício"
            : "+ Adicionar exercício"
        }
        tipo="secundario"
        onPress={adicionarExercicio}
      />
     
      {idExercicioEditando !== null && (
        <BotaoPersonalizado
          titulo="Cancelar edição"
          tipo="secundario"
          onPress={cancelarEdicao}
        />
      )}

      <Text style={styles.secao}>Exercícios da ficha</Text>

      {exercicios.length === 0 ? (
        <Text style={styles.info}>
          Nenhum exercício nesta ficha.
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
               
            <BotaoPersonalizado
              titulo="Editar exercício"
              tipo="primario"
              onPress={() => iniciarEdicao(exercicio)}
            />

            <BotaoPersonalizado
              titulo="Remover exercício"
              tipo="perigo"
              onPress={() => removerExercicio(exercicio.id)}
            />
          </View>
        ))
      )}
      
      <BotaoPersonalizado
        titulo="Salvar alterações"
        tipo="sucesso"
        onPress={salvarAlteracoes}
        desabilitado={salvando}
        carregando={salvando}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
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
    marginTop: 10,
    marginBottom: 25,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1f2937",
    color: "#ffffff",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#374151",
  },  
  botao: {
    backgroundColor: "#2563eb",
    minHeight: 50,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginTop: 30,
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },
  secao: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
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
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 8,
  },
    botaoRemover: {
    backgroundColor: "#7f1d1d",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 15,
  },
  textoRemover: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  botaoAdicionar: {
    backgroundColor: "#374151",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  botaoEditarExercicio: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 15,
  },
  botaoCancelar: {
    backgroundColor: "#4b5563",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
  },
});
