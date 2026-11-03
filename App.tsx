import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroDoacaoScreen from './src/screens/CadastroDoacaoScreen';
import DetalheDoacaoScreen from './src/screens/DetalheDoacaoScreen';
import DetalhePontoScreen from './src/screens/DetalhePontoScreen';
import HistoricoDoacoesScreen from './src/screens/HistoricoDoacoesScreen';
import ListaPontosScreen from './src/screens/ListaPontosScreen';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaPontos">
        <Stack.Screen
          name="ListaPontos"
          component={ListaPontosScreen}
          options={{ title: 'Pontos do Instituto' }}
        />
        <Stack.Screen
          name="DetalhePonto"
          component={DetalhePontoScreen}
          options={{ title: 'Detalhe do ponto' }}
        />
        <Stack.Screen
          name="HistoricoDoacoes"
          component={HistoricoDoacoesScreen}
          options={{ title: 'Minhas doacoes' }}
        />
        <Stack.Screen
          name="DetalheDoacao"
          component={DetalheDoacaoScreen}
          options={{ title: 'Detalhe da doacao' }}
        />
        <Stack.Screen
          name="CadastroDoacao"
          component={CadastroDoacaoScreen}
          options={({ route }) => ({
            title: route.params?.doacaoId ? 'Editar doacao' : 'Cadastro de doacao',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
