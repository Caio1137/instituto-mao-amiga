import { Alert, Platform } from 'react-native';

/**
 * Pede confirmação antes de excluir: Alert.alert com "Cancelar" e "Excluir".
 * No navegador o Alert do React Native não mostra nada, então usamos o confirm do navegador.
 */
export function confirmarExclusao(titulo: string, mensagem: string, onExcluir: () => void) {
  if (Platform.OS === 'web') {
    const confirmar = (globalThis as { confirm?: (texto: string) => boolean }).confirm;
    if (confirmar?.(`${titulo}\n\n${mensagem}`)) {
      onExcluir();
    }
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: onExcluir },
  ]);
}
