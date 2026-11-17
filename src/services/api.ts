// Único arquivo do app que chama fetch. A URL do servidor fica só aqui.
// O .env.local permite trocar o IP para usar o celular sem editar o código.
// No celular, usamos o IP do computador; localhost aponta para o próprio celular.
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8085/api/v1').replace(/\/$/, '');

const TEMPO_LIMITE_MS = 10000;

/** Erro de uma chamada à API. status 0 = não conseguiu falar com o servidor. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function mensagemErro(erro: unknown): string {
  return erro instanceof ApiError
    ? erro.message
    : 'Não foi possível concluir a operação. Tente novamente.';
}

async function requisicao<T>(metodo: string, caminho: string, corpo?: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TEMPO_LIMITE_MS);
  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      signal: controller.signal,
      headers: corpo === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar à API. Verifique se ela está ligada e se o endereço do servidor está certo.');
  } finally {
    clearTimeout(timer);
  }

  if (!resposta.ok) {
    // A API devolve { status, mensagem } nos erros 400 e 404.
    const dados = (await resposta.json().catch(() => null)) as { mensagem?: string } | null;
    const mensagem = resposta.status >= 500
      ? 'A API teve um erro interno. Tente novamente em instantes.'
      : dados?.mensagem ?? `A API respondeu ${resposta.status}.`;
    throw new ApiError(resposta.status, mensagem);
  }

  // DELETE responde 204 sem corpo.
  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}

export function get<T>(caminho: string): Promise<T> {
  return requisicao<T>('GET', caminho);
}

export function post<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisicao<T>('POST', caminho, corpo);
}

export function put<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisicao<T>('PUT', caminho, corpo);
}

export function del(caminho: string): Promise<void> {
  return requisicao<void>('DELETE', caminho);
}
