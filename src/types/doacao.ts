export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

export type DadosDoacao = Pick<Doacao, 'tipoItem' | 'quantidade' | 'pontoDestino'>;

export type TotalPorTipo = {
  chave: string;
  tipoItem: string;
  quantidade: number;
  doacoes: number;
};
