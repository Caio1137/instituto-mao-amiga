// Espelha o record DoacaoResponseDTO da API. criadoEm vem como "2026-11-16T10:20:44" (LocalDateTime).
export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

// Corpo do POST e do PUT (DoacaoRequestDTO): o app não envia id nem criadoEm.
export type DadosDoacao = Pick<Doacao, 'tipoItem' | 'quantidade' | 'pontoDestino'>;
