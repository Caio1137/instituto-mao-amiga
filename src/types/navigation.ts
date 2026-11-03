export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: number };
  HistoricoDoacoes: undefined;
  DetalheDoacao: { doacaoId: string };
  CadastroDoacao: { doacaoId?: string } | undefined;
};
