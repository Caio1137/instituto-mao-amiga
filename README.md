# Instituto Mão Amiga

Aplicativo mobile para apoiar o registro e o acompanhamento de doações destinadas ao Instituto Mão Amiga.

## Funcionalidades

- Consulta dos pontos de coleta e distribuição.
- Visualização dos detalhes de cada ponto.
- Cadastro de doações com validação dos campos.
- Histórico de doações salvo no aparelho.
- Busca de doações por tipo de item.
- Visualização, edição e exclusão de registros.
- Resumo das quantidades doadas por tipo de item.

## Tecnologias

- React Native
- Expo
- React Navigation
- AsyncStorage

## Como executar

É necessário ter o Node.js instalado.

```bash
git clone https://github.com/Caio1137/instituto-mao-amiga.git
cd instituto-mao-amiga
npm install
npx expo start --tunnel
```

Depois, abra o Expo Go no celular e leia o QR Code exibido no terminal. Para testar no navegador, execute:

```bash
npm run web
```

## Fluxo de uso

1. Consulte os pontos de coleta e distribuição disponíveis.
2. Registre uma doação informando o tipo do item, a quantidade e o ponto de destino.
3. Acesse **Minhas doações** para consultar o histórico e o resumo.
4. Use a busca para localizar registros por tipo de item.
5. Abra uma doação para editar seus dados ou excluí-la com confirmação.

Os registros ficam armazenados localmente no aparelho e permanecem disponíveis ao reabrir o aplicativo.
