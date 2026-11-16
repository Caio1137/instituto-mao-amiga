export type RootStackParamList = {
  ListaPontos: { mensagem?: string } | undefined;
  DetalhePonto: { pontoId: string };
  CadastroPonto: { pontoId?: string } | undefined;
  MeusPontos: undefined;
  HistoricoDoacoes: { mensagem?: string } | undefined;
  DetalheDoacao: { doacaoId: string };
  CadastroDoacao: { doacaoId?: string } | undefined;
};
