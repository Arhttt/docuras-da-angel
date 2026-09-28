const BRAZIL_TIMEZONE = 'America/Sao_Paulo';

/**
 * Formata data e hora no fuso horário oficial da confeitaria (America/Sao_Paulo).
 */
export function formatDateTimeBr(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRAZIL_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Formata apenas a data no padrão brasileiro DD/MM/AAAA.
 */
export function formatDateBr(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: BRAZIL_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

/**
 * Verifica se uma data/horário de reserva já expirou em relação ao momento atual.
 */
export function isExpired(expiresAt: string | Date): boolean {
  const exp = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return exp.getTime() < Date.now();
}

/**
 * Retorna uma data futura adicionando minutos a partir do momento atual (ex: 30 min para reservas).
 */
export function addMinutesToNow(minutes: number): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}
