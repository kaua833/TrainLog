
import { Alert, Platform } from "react-native";

export function mostrarMensagem(
  titulo: string,
  mensagem: string
) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

export function confirmarAcao(
  titulo: string,
  mensagem: string,
  aoConfirmar: () => void
) {
  if (Platform.OS === "web") {
    const confirmou = window.confirm(
      `${titulo}\n\n${mensagem}`
    );

    if (confirmou) {
      aoConfirmar();
    }
  } else {
    Alert.alert(titulo, mensagem, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Confirmar",
        style: "destructive",
        onPress: aoConfirmar,
      },
    ]);
  }
}
