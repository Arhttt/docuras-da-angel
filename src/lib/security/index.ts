import crypto from 'crypto';

/**
 * Gera um token criptograficamente seguro com alta entropia para acesso de visitantes.
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Gera o hash SHA-256 de um token antes de persistir no banco de dados.
 * O token bruto NUNCA deve ser persistido.
 */
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Compara tokens em tempo constante para mitigar ataques de timing.
 */
export function safeCompareHashes(hashA: string, hashB: string): boolean {
  if (hashA.length !== hashB.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hashA, 'hex'), Buffer.from(hashB, 'hex'));
}

/**
 * Gera o hash estável do payload da requisição para verificação de idempotência.
 */
export function hashRequestPayload(payload: unknown): string {
  const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Sanitiza e redige dados sensíveis de objetos antes de registrar em logs.
 */
export function sanitizeLogData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'token', 'secret', 'cardnumber', 'card_number', 'cvv', 'document', 'cpf'];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeLogData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
