import { useCallback, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert, } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import TreinoCard from "../../components/TreinoCard";
import { Treino } from "../../data/treinos";
import { buscarTreinos } from "../../services/treinoStorage";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TreinosScreen() {
  const router = useRouter();
  const [listaTreinos, setListaTreinos] = useState<Treino[]>([]);
  const [carregando, setCarregando] = useState(true);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      async function carregarTreinos() {
        try {
          const dados = await buscarTreinos();

          if (ativo) {
            setListaTreinos(dados);
          }
        } catch (error) {
          console.error("Erro ao buscar treinos:", error);

          if (ativo) {
            Alert.alert(
              "Erro",
              "Não foi possível carregar os treinos."
            );
          }
        } finally {
          if (ativo) {
            setCarregando(false);
          }
        }
      }

      carregarTreinos();

      return () => {
        ativo = false;
      };
    }, [])
  );

  function abrirDetalhes(id: string) {
    router.push({
      pathname: "/detalhes/[id]",
      params: { id },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meus Treinos</Text>

      <Text style={styles.subtitulo}>
        Organize suas fichas de treino.
      </Text>

      <Pressable
        style={styles.botaoCriar}
        onPress={() => router.push("/criar-treino")}
      >
        <Text style={styles.textoBotao}>
          + Criar novo treino
        </Text>
      </Pressable>

      {carregando ? (
        <Text style={styles.mensagem}>
          Carregando treinos...
        </Text>
      ) : (
        <FlatList
          data={listaTreinos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TreinoCard
              nome={item.nome}
              grupo={item.grupo}
              exercicios={item.exercicios.length}
              onPress={() => abrirDetalhes(item.id)}
            />
          )}          
          contentContainerStyle={[
            styles.lista,
            { paddingBottom: 24 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={           
            <View style={styles.estadoVazio}>
              <Ionicons
                name="barbell-outline"
                size={56}
                color="#60a5fa"
              />

              <Text style={styles.tituloVazio}>
                Nenhum treino cadastrado
              </Text>

              <Text style={styles.descricaoVazio}>
                Você ainda não criou nenhuma ficha.
                Comece cadastrando seu primeiro treino!
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
  botaoCriar: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  mensagem: {
    color: "#9ca3af",
    fontSize: 15,
    textAlign: "center",
    marginTop: 30,
  },
  lista: {
    paddingBottom: 30,
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
