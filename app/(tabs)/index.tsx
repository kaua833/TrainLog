import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, } from "react-native";
import { useFocusEffect } from "expo-router";
import { buscarTreinos } from "../../services/treinoStorage";
import { buscarHistorico } from "../../services/historicoStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BotaoPersonalizado from "../../components/BotaoPersonalizado";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [totalTreinos, setTotalTreinos] = useState(0);
  const [totalRealizados, setTotalRealizados] = useState(0);
  const [totalExercicios, setTotalExercicios] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarEstatisticas() {
        try {
          const [treinos, historico] = await Promise.all([
            buscarTreinos(),
            buscarHistorico(),
          ]);

          const quantidadeExercicios = treinos.reduce(
            (total, treino) => total + treino.exercicios.length,
            0
          );

          if (ativo) {
            setTotalTreinos(treinos.length);
            setTotalRealizados(historico.length);
            setTotalExercicios(quantidadeExercicios);
          }
        } catch (error) {
          console.error(
            "Erro ao carregar estatísticas:",
            error
          );
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarEstatisticas();

      return () => {
        ativo = false;
      };
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.conteudo,
        { paddingBottom: 24 + insets.bottom },
      ]}
      showsVerticalScrollIndicator={false}
    >
      
      <View style={styles.cabecalho}>
        <Text style={styles.nomeApp}>
          TrainLog
        </Text>

        <Text style={styles.subtitulo}>
          Seu progresso começa com organização.
        </Text>

        <Text style={styles.boasVindas}>
          Bem-vindo ao seu painel de treinos!
        </Text>
      </View>

      <Text style={styles.secao}>Visão geral</Text>

      {carregando ? (
        <Text style={styles.mensagem}>
          Carregando estatísticas...
        </Text>
      ) : (
        <>
        <View style={styles.estatisticas}>
          <View style={styles.card}>
            <Ionicons
              name="albums-outline"
              size={26}
              color="#60a5fa"
              style={styles.iconeEstatistica}
            />
            <Text style={styles.numero}>
              {totalTreinos}
            </Text>
            <Text style={styles.descricao}>
              Fichas cadastradas
            </Text>
          </View>

          <View style={styles.card}>
            <Ionicons
              name="checkmark-circle-outline"
              size={26}
              color="#34d399"
              style={styles.iconeEstatistica}
            />
            <Text style={styles.numero}>
              {totalRealizados}
            </Text>
            <Text style={styles.descricao}>
              Treinos realizados
            </Text>
          </View>

          <View style={styles.card}>
            <Ionicons
              name="barbell-outline"
              size={26}
              color="#60a5fa"
              style={styles.iconeEstatistica}
            />
            <Text style={styles.numero}>
              {totalExercicios}
            </Text>
            <Text style={styles.descricao}>
              Exercícios cadastrados
            </Text>
          </View>
        </View>

        <View style={styles.acoesRapidas}>
            <Text style={styles.tituloAcoes}>
              Ações rápidas
            </Text>

            <BotaoPersonalizado
              titulo="+ Criar novo treino"
              tipo="primario"
              onPress={() => router.push("/criar-treino")}
            />

            <BotaoPersonalizado
            titulo="Ver histórico"
            tipo="secundario"
            onPress={() => router.push("/historico")}
            />
        </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  iconeEstatistica: {
    marginBottom: 10,
  },

  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
 
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  titulo: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#60a5fa",
    marginTop: 30,
  },

  cabecalho: {
    marginBottom: 28,
    paddingTop: 12,
  },

  nomeApp: {
    color: "#60a5fa",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 6,
  },

  subtitulo: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 20,
  },

  boasVindas: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },

  secao: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 18,
    marginTop: 10,
  },

  estatisticas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#1f2937",
    borderRadius: 14,
    padding: 16,
    minWidth: 140,
    flexGrow: 1,
    flexBasis: "40%",
    borderWidth: 1,
    borderColor: "#374151",
  },

  numero: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#60a5fa",
    marginBottom: 8,
  },

  descricao: {
    fontSize: 13,
    color: "#d1d5db",
  },

  botao: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 17,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },

  botaoSecundario: {
    backgroundColor: "#374151",
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    padding: 17,
    borderRadius: 12,
    overflow: "hidden",
  },

  mensagem: {
    color: "#9ca3af",
    marginBottom: 25,
  },

  acoesRapidas: {
    marginTop: 28,
    marginBottom: 20,
  },

  tituloAcoes: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 14,
  },
});