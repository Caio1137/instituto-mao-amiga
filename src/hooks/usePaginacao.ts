import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { mensagemErro } from '../services/api';
import type { Page } from '../types/page';

type BuscarPagina<T> = (filtro: string, pagina: number) => Promise<Page<T>>;

/**
 * Lista com rolagem infinita sobre um endpoint paginado da API.
 * - Volta para a primeira página quando o filtro muda e sempre que a tela ganha foco
 *   (assim um item cadastrado, editado ou excluído aparece certo ao voltar).
 * - Nunca pede a mesma página duas vezes e para na última.
 * - A função buscarPagina deve ser estável (uma função de service, por exemplo).
 */
export function usePaginacao<T extends { id: string }>(buscarPagina: BuscarPagina<T>, filtro: string) {
  const [itens, setItens] = useState<T[]>([]);
  const [pagina, setPagina] = useState<Page<T>['page'] | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [erro, setErro] = useState('');
  const [erroMais, setErroMais] = useState('');
  const [versao, setVersao] = useState(0);

  // Refs mudam na hora; o estado só muda no próximo render, e onEndReached
  // pode disparar várias vezes antes disso.
  const geracao = useRef(0);
  const ocupado = useRef(false);
  const paginasPedidas = useRef(new Set<number>());
  const falhouMais = useRef(false);

  useFocusEffect(useCallback(() => {
    const atual = ++geracao.current;
    ocupado.current = true;
    falhouMais.current = false;
    paginasPedidas.current = new Set([0]);
    setItens([]);
    setPagina(null);
    setCarregando(true);
    setCarregandoMais(false);
    setErro('');
    setErroMais('');

    // Espera a pessoa parar de digitar antes de chamar a API.
    const timer = setTimeout(async () => {
      try {
        const resposta = await buscarPagina(filtro, 0);
        if (geracao.current !== atual) return;
        setItens(resposta.content);
        setPagina(resposta.page);
      } catch (falha) {
        if (geracao.current === atual) setErro(mensagemErro(falha));
      } finally {
        if (geracao.current === atual) {
          ocupado.current = false;
          setCarregando(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      geracao.current++;
    };
  }, [buscarPagina, filtro, versao]));

  const temMais = pagina !== null && pagina.number + 1 < pagina.totalPages;

  async function carregarMais(repetir = false) {
    if (!pagina || !temMais || ocupado.current) return;
    if (falhouMais.current && !repetir) return;

    const proxima = pagina.number + 1;
    if (paginasPedidas.current.has(proxima)) return;

    paginasPedidas.current.add(proxima);
    ocupado.current = true;
    falhouMais.current = false;
    const atual = geracao.current;
    setCarregandoMais(true);
    setErroMais('');

    try {
      const resposta = await buscarPagina(filtro, proxima);
      if (geracao.current !== atual) return;
      // Se algo foi cadastrado no meio do caminho, um item pode vir repetido; fica só uma vez.
      setItens((anteriores) => {
        const ids = new Set(anteriores.map((item) => item.id));
        return [...anteriores, ...resposta.content.filter((item) => !ids.has(item.id))];
      });
      setPagina(resposta.page);
    } catch (falha) {
      if (geracao.current !== atual) return;
      paginasPedidas.current.delete(proxima);
      falhouMais.current = true;
      setErroMais(mensagemErro(falha));
    } finally {
      if (geracao.current === atual) {
        ocupado.current = false;
        setCarregandoMais(false);
      }
    }
  }

  return {
    itens,
    pagina,
    carregando,
    carregandoMais,
    erro,
    erroMais,
    temMais,
    carregarMais,
    recarregar: () => setVersao((valor) => valor + 1),
  };
}
