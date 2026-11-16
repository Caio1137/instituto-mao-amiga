import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { carregarFavoritos, salvarFavoritos } from '../services/favoritosStorage';

/** Ids dos pontos favoritos, relidos do AsyncStorage sempre que a tela ganha foco. */
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [carregado, setCarregado] = useState(false);
  const [erroFavoritos, setErroFavoritos] = useState('');

  useFocusEffect(useCallback(() => {
    let ativo = true;
    carregarFavoritos()
      .then((ids) => { if (ativo) setFavoritos(ids); })
      .catch(() => { if (ativo) setErroFavoritos('Não foi possível ler os favoritos salvos neste aparelho.'); })
      .finally(() => { if (ativo) setCarregado(true); });
    return () => { ativo = false; };
  }, []));

  const gravar = useCallback((novos: string[]) => {
    setFavoritos(novos);
    salvarFavoritos(novos)
      .then(() => setErroFavoritos(''))
      .catch(() => setErroFavoritos('Não foi possível salvar os favoritos neste aparelho.'));
  }, []);

  const alternar = useCallback((id: string) => {
    gravar(favoritos.includes(id) ? favoritos.filter((favorito) => favorito !== id) : [...favoritos, id]);
  }, [favoritos, gravar]);

  return { favoritos, carregado, erroFavoritos, alternar };
}
