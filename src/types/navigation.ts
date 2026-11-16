export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: string };
  HistoricoDoacoes: undefined;
  DetalheDoacao: { doacaoId: string };
  CadastroDoacao: { doacaoId?: string } | undefined;
};
