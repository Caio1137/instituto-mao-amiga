// Espelha o record PontoResponseDTO da API (api/.../dto/PontoResponseDTO.java), campo a campo.
export type TipoPonto = 'coleta' | 'distribuição';

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: TipoPonto;
};

// Corpo do POST e do PUT (PontoRequestDTO): tudo menos o id.
export type DadosPonto = Omit<Ponto, 'id'>;
