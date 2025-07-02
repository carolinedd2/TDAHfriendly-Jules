// src/utils/helpers.ts

/**
 * Retorna a data de hoje no formato "YYYY-MM-DD".
 */
export function getTodayDateString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Recebe uma string "YYYY-MM-DD" e retorna outra, 
 * já acrescida de `days` dias no mesmo formato.
 */
export function addDaysToDateString(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
