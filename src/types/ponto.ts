// Espelha o record PontoResponse da API (api/.../dto/PontoResponse.java), campo a campo.
export type Ponto = {
  id: number;
  nome: string;
  endereco: string;
  horario: string;
  atendimento: string;
  latitude: number;
  longitude: number;
};
