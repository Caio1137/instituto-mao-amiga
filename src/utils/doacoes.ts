// A API manda LocalDateTime sem fuso ("2026-11-16T10:20:44"); o Date lê como horário local.
export function formatarData(data: string): string {
  const convertida = new Date(data);

  if (Number.isNaN(convertida.getTime())) {
    return data;
  }

  return convertida.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
