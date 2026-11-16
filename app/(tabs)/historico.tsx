import { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Pressable, ScrollView, } from "react-native";
import { useFocusEffect } from "expo-router";
import { buscarHistorico, excluirRegistro, RegistroTreino, } from "../../services/historicoStorage";
import { confirmarAcao, mostrarMensagem, } from "../../services/alerta";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BotaoPersonalizado from "../../components/BotaoPersonalizado";

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState<RegistroTreino[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroSelecionado, setFiltroSelecionado] = useState<string>("todos");
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarHistorico() {
        try {
          const registros = await buscarHistorico();

          if (ativo) {
            setHistorico(registros);
          }
        } catch (error) {
          console.error("Erro ao carregar histórico:", error);

          if (ativo) {
            Alert.alert(
              "Erro",
              "Não foi possível carregar o histórico."
            );
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarHistorico();

      const fichasDisponiveis = Array.from(
        new Map(
          historico.map((registro) => [
            registro.treinoId,
            {
              id: registro.treinoId,
              nome: registro.nomeTreino,
            },
          ])
        ).values()
      );

      const historicoFiltrado =
        filtroSelecionado === "todos"
        ? historico
        : historico.filter(
            (registro) =>
              registro.treinoId === filtroSelecionado
        );

      const totalRegistros = historicoFiltrado.length;

      const totalExerciciosRealizados = historicoFiltrado.reduce(
        (total, registro) =>
          total + registro.quantidadeExercicios,
        0
      );

        return () => {
          ativo = false;
        };
      }, [])
    );

  
  function confirmarExclusao(id: string) {
    confirmarAcao(
      "Excluir registro",
      "Deseja realmente excluir este registro do histórico?",
      async () => {
        try {
          await excluirRegistro(id);

          const registrosAtualizados =
            await buscarHistorico();

          setHistorico(registrosAtualizados);
        } catch (error) {
          console.error(
            "Erro ao excluir registro:",
            error
          );

          mostrarMensagem(
            "Erro",
            "Não foi possível excluir o registro."
          );
        }
      }
    );
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const fichasDisponiveis = Array.from(
    new Map(
      historico.map((registro) => [
        registro.treinoId,
        {
          id: registro.treinoId,
          nome: registro.nomeTreino,
        },
      ])
    ).values()
  );

  const historicoFiltrado =
    filtroSelecionado === "todos"
      ? historico
      : historico.filter(
          (registro) =>
            registro.treinoId === filtroSelecionado
        );

  const totalRegistros = historicoFiltrado.length;

  const totalExerciciosRealizados = historicoFiltrado.reduce(
    (total, registro) =>
      total + registro.quantidadeExercicios,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Treinos</Text>

      <Text style={styles.subtitulo}>
        Consulte suas atividades registradas.
      </Text>

      <Text style={styles.tituloFiltro}>
        Filtrar por ficha
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.areaFiltros}
        contentContainerStyle={styles.listaFiltros}
      >
        <Pressable
          style={[
            styles.botaoFiltro,
            filtroSelecionado === "todos" &&
              styles.botaoFiltroAtivo,
          ]}
          onPress={() => setFiltroSelecionado("todos")}
        >
          <Text style={styles.textoFiltro}>Todos</Text>
        </Pressable>

        {fichasDisponiveis.map((ficha) => (
          <Pressable
            key={ficha.id}
            style={[
              styles.botaoFiltro,
              filtroSelecionado === ficha.id &&
                styles.botaoFiltroAtivo,
            ]}
            onPress={() => setFiltroSelecionado(ficha.id)}
          >
            <Text style={styles.textoFiltro}>
              {ficha.nome}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.areaEstatisticas}>
        <View style={styles.cardEstatistica}>
          <Text style={styles.numeroEstatistica}>
            {totalRegistros}
          </Text>

          <Text style={styles.descricaoEstatistica}>
            Treinos realizados
          </Text>
        </View>

        <View style={styles.cardEstatistica}>
          <Text style={styles.numeroEstatistica}>
            {totalExerciciosRealizados}
          </Text>

          <Text style={styles.descricaoEstatistica}>
            Exercícios registrados
          </Text>
        </View>
      </View>

      {carregando ? (
        <Text style={styles.mensagem}>
          Carregando histórico...
        </Text>
      ) : (
        <FlatList
          data={historicoFiltrado}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nome}>
                {item.nomeTreino}
              </Text>

              <Text style={styles.grupo}>
                {item.grupo}
              </Text>

              <Text style={styles.info}>
                Data: {formatarData(item.data)}
              </Text>

              <Text style={styles.info}>
                Exercícios: {item.quantidadeExercicios}
              </Text>
             
              <BotaoPersonalizado
                titulo="Excluir registro"
                tipo="perigo"
                onPress={() => confirmarExclusao(item.id)}
              />
            </View>
          )}
          contentContainerStyle={[
            styles.lista,
            { paddingBottom: 24 + insets.bottom },
          ]}
          ListEmptyComponent={           
            <View style={styles.estadoVazio}>
              <Ionicons
                name="time-outline"
                size={56}
                color="#60a5fa"
              />

              <Text style={styles.tituloVazio}>
                Nenhum treino registrado
              </Text>

              <Text style={styles.descricaoVazio}>
                Quando você concluir um treino,
                ele aparecerá aqui no histórico.
              </Text>
            </View>
          }
        />
      )}
    </View>
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
    color: "#ffffff",
    marginTop: 20,
  },

  subtitulo: {
    fontSize: 15,
    color: "#9ca3af",
    marginTop: 8,
    marginBottom: 25,
  },

  lista: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#1f2937",
    borderRadius: 14,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#374151",
  },

  nome: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#60a5fa",
  },

  grupo: {
    fontSize: 15,
    color: "#ffffff",
    marginTop: 8,
  },

  info: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 10,
  },

  mensagem: {
    color: "#9ca3af",
    fontSize: 15,
    textAlign: "center",
    marginTop: 30,
  },

  tituloFiltro: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
 
  areaFiltros: {
    height: 55,
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 20,
  },

  listaFiltros: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 10,
    paddingBottom: 5,
  },
 
  botaoFiltro: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 42,
  },

  botaoFiltroAtivo: {
    backgroundColor: "#2563eb",
  },

  textoFiltro: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },

  areaEstatisticas: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  cardEstatistica: {
    flex: 1,
    backgroundColor: "#1f2937",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    minWidth: 0,
  },

  numeroEstatistica: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#60a5fa",
    marginBottom: 8,
  },

  descricaoEstatistica: {
    fontSize: 13,
    color: "#d1d5db",
    flexShrink: 1,
  },

  estadoVazio: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 12,
  },

  tituloVazio: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  descricaoVazio: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
});
