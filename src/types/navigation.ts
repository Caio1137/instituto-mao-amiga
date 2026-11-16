export type RootStackParamList = {
  ListaPontos: { mensagem?: string } | undefined;
  DetalhePonto: { pontoId: string };
  CadastroPonto: { pontoId?: string } | undefined;
  HistoricoDoacoes: undefined;
  DetalheDoacao: { doacaoId: string };
  CadastroDoacao: { doacaoId?: string } | undefined;
};
