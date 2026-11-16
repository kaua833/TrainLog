
import { Pressable, Text, StyleSheet, ActivityIndicator, } from "react-native";

type Props = {
  titulo: string;
  onPress: () => void;
  tipo?: "primario" | "secundario" | "perigo" | "sucesso";
  desabilitado?: boolean;
  carregando?: boolean;
};

export default function BotaoPersonalizado({
  titulo,
  onPress,
  tipo = "primario",
  desabilitado = false,
  carregando = false,
}: Props) {
  const cores = {
    primario: "#2563eb",
    secundario: "#374151",
    perigo: "#dc2626",
    sucesso: "#059669",
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado || carregando}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: cores[tipo] },
        pressed && styles.pressionado,
        (desabilitado || carregando) &&
          styles.desabilitado,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.texto}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginVertical: 6,
  },

  texto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
  },

  pressionado: {
    opacity: 0.8,
  },

  desabilitado: {
    opacity: 0.5,
  },
});
