import { registrarTreino, RegistroTreino, } from "../../services/historicoStorage";
import { useCallback, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert, } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter, } from "expo-router";
import { Treino } from "../../data/treinos";
import { buscarTreinos, excluirTreino, } from "../../services/treinoStorage";
import { confirmarAcao, mostrarMensagem, } from "../../services/alerta";
import BotaoPersonalizado from "../../components/BotaoPersonalizado";

export default function DetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [treino, setTreino] = useState<Treino | null>(null);
  const [carregando, setCarregando] = useState(true);

  async function concluirTreino() {
    if (!treino) return;

    const registro: RegistroTreino = {
      id: Date.now().toString() + Math.random().toString(),
      treinoId: treino.id,
      nomeTreino: treino.nome,
      grupo: treino.grupo,
      data: new Date().toISOString(),
      quantidadeExercicios: treino.exercicios.length,
    };

    try {
      await registrarTreino(registro);

      mostrarMensagem(
        "Treino registrado!",
        "Sua atividade foi adicionada ao histórico."
      );
    } catch (error) {
      console.error("Erro ao registrar treino:", error);

      Alert.alert(
        "Erro",
        "Não foi possível registrar a atividade."
      );
    }
  }

  function confirmarExclusao() {
    confirmarAcao(
      "Excluir treino",
      "Deseja realmente excluir esta ficha?",
      async () => {
        try {
          await excluirTreino(id);
          router.replace("/treinos");
        } catch (error) {
          console.error("Erro ao excluir treino:", error);

          mostrarMensagem(
            "Erro",
            "Não foi possível excluir a ficha."
          );
        }
      }
    );
  }

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarTreino() {
        try {
          const lista = await buscarTreinos();
          const encontrado = lista.find((item) => item.id === id);

          if (ativo) {
            setTreino(encontrado ?? null);
          }
        } catch (error) {
          console.error("Erro ao carregar treino:", error);

          if (ativo) {
            setTreino(null);
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarTreino();

      return () => {
        ativo = false;
      };
    }, [id])
  );

  if (carregando) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Carregando treino...</Text>
      </View>
    );
  }

  if (!treino) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>
          Treino não encontrado
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{treino.nome}</Text>

      <Text style={styles.subtitulo}>{treino.grupo}</Text>

      <Text style={styles.secao}>Exercícios</Text>

      <FlatList
        data={treino.exercicios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>

            <Text style={styles.info}>
              Séries: {item.series}
            </Text>

            <Text style={styles.info}>
              Repetições: {item.repeticoes}
            </Text>
          </View>
        )}
       
        ListFooterComponent={
          <View>           
            <BotaoPersonalizado
              titulo="Concluir treino"
              onPress={concluirTreino}
              tipo="sucesso"
            />
           
            <BotaoPersonalizado
              titulo="Editar treino"
              tipo="secundario"
              onPress={() =>
                router.push({
                  pathname: "/editar/[id]",
                  params: { id: treino.id },
                })
              }
            />
            
            <BotaoPersonalizado
              titulo="Excluir treino"
              tipo="perigo"
              onPress={confirmarExclusao}
            />
         
            <BotaoPersonalizado
              titulo="Voltar para meus treinos"
              tipo="primario"
              onPress={() => router.replace("/treinos")}
            />
        </View>
      }

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 20,
  },
  botaoEditar: {
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#60a5fa",
    marginTop: 20,
  },
  subtitulo: {
    fontSize: 16,
    color: "#ffffff",
    marginTop: 8,
  },
  secao: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 30,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  info: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
  botao: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
  },
  textoBotao: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },

  botaoExcluir: {
    backgroundColor: "#dc2626",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  botaoConcluir: {
    backgroundColor: "#059669",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
});
