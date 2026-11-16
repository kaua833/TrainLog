
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

// PROPS: informações recebidas da tela Meus Treinos
type TreinoCardProps = {
  nome: string;
  grupo: string;
  exercicios: number;
  onPress: () => void;
};

export default function TreinoCard({
  nome,
  grupo,
  exercicios,
  onPress,
}: TreinoCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View>
        <Text style={styles.nome}>{nome}</Text>

        <Text style={styles.grupo}>{grupo}</Text>

        <Text style={styles.exercicios}>
          {exercicios} exercícios
        </Text>

        <Text style={styles.detalhes}>
          Ver detalhes →
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 16,
    color: "#ffffff",
    marginTop: 8,
  },

  exercicios: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 10,
  },

  detalhes: {
    fontSize: 14,
    color: "#60a5fa",
    fontWeight: "600",
    marginTop: 12,
  },
});
