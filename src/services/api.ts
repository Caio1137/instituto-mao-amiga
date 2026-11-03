// Endereço da API dos pontos (pasta api/ deste repositório).
// No navegador e no emulador iOS, localhost funciona. No celular com Expo Go,
// troque localhost pelo IP do computador na rede (ex.: http://192.168.0.10:8085).
const API_URL = 'http://localhost:8085';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function getJson<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${API_URL}${caminho}`);

  if (!resposta.ok) {
    throw new ApiError(resposta.status, `A API respondeu ${resposta.status} para ${caminho}.`);
  }

  return (await resposta.json()) as T;
}
