export const CATEGORIAS = {
  Instalacao: 'Instalação',
  Manutencao: 'Manutenção',
  Suporte: 'Suporte',
};

export const PRIORIDADES = {
  Baixa: 'Baixa',
  Media: 'Média',
  Alta: 'Alta',
};

export const STATUS = {
  Aberta: 'Aberta',
  EmAndamento: 'Em andamento',
  Concluida: 'Concluída',
  Cancelada: 'Cancelada',
};

export function formatarData(dataIso) {
  if (!dataIso) return '-';
  return new Date(dataIso).toLocaleString('pt-BR');
}