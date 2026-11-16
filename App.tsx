import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroDoacaoScreen from './src/screens/CadastroDoacaoScreen';
import CadastroPontoScreen from './src/screens/CadastroPontoScreen';
import DetalheDoacaoScreen from './src/screens/DetalheDoacaoScreen';
import DetalhePontoScreen from './src/screens/DetalhePontoScreen';
import HistoricoDoacoesScreen from './src/screens/HistoricoDoacoesScreen';
import ListaPontosScreen from './src/screens/ListaPontosScreen';
import MeusPontosScreen from './src/screens/MeusPontosScreen';
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
          name="CadastroPonto"
          component={CadastroPontoScreen}
          options={({ route }) => ({
            title: route.params?.pontoId ? 'Editar ponto' : 'Cadastrar ponto',
          })}
        />
        <Stack.Screen
          name="MeusPontos"
          component={MeusPontosScreen}
          options={{ title: 'Meus pontos' }}
        />
        <Stack.Screen
          name="HistoricoDoacoes"
          component={HistoricoDoacoesScreen}
          options={{ title: 'Minhas doações' }}
        />
        <Stack.Screen
          name="DetalheDoacao"
          component={DetalheDoacaoScreen}
          options={{ title: 'Detalhe da doação' }}
        />
        <Stack.Screen
          name="CadastroDoacao"
          component={CadastroDoacaoScreen}
          options={({ route }) => ({
            title: route.params?.doacaoId ? 'Editar doação' : 'Registrar doação',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
