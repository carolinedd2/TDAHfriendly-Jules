export interface TailwindColorClasses {
  border: any;
  bgColor: string;
  textColor: string;
  borderColor: string;
  bgSoft: string;
  ringColor: string;
}

// Lista segura de cores base compatíveis com Tailwind
const allowedBaseColors = [
  'blue', 'green', 'yellow', 'purple', 'red',
  'indigo', 'pink', 'orange', 'teal', 'gray',
  'brown', 'cyan', 'lime', 'sky', 'rose', 'navy-blue',
];

// Função que retorna a cor se válida, ou 'gray' como fallback
export function validateBaseColor(baseColor: string): string {
  return allowedBaseColors.includes(baseColor) ? baseColor : 'gray';
}

// Função principal para gerar classes seguras com base em uma cor
export function getValidatedTailwindColorClasses(baseColor: string): TailwindColorClasses {
  const safeColor = validateBaseColor(baseColor);

return {
  bgColor: `bg-${safeColor}-500`,
  textColor: `text-${safeColor}-600`,
  borderColor: `border-${safeColor}-500`,
  bgSoft: `bg-${safeColor}-100/60`,
  ringColor: `focus:ring-${safeColor}-300`,
  border: undefined
};
}
