import { Lead } from '../types';

export interface TargetLocationConfig {
  key: 'cocaia_guarulhos' | 'senac_jurubatuba' | 'maria_benedita_91' | 'copan_ipiranga';
  label: string;
  shortLabel: string;
  badgeColor: string;
  bgLight: string;
  borderLight: string;
  textColor: string;
  city: string;
  state: string;
  neighborhood: string;
  defaultAddress: string;
  description: string;
  matchTerms: string[];
}

export const TARGET_LOCATIONS: Record<string, TargetLocationConfig> = {
  cocaia_guarulhos: {
    key: 'cocaia_guarulhos',
    label: 'Cocaia - Guarulhos (SP)',
    shortLabel: 'Cocaia (Guarulhos)',
    badgeColor: 'bg-blue-500',
    bgLight: 'bg-blue-50',
    borderLight: 'border-blue-300',
    textColor: 'text-blue-700',
    city: 'Guarulhos',
    state: 'SP',
    neighborhood: 'Jardim Cocaia',
    defaultAddress: 'Av. Brigadeiro Faria Lima / Rua Cocaia',
    description: 'Comércios locais no Jardim Cocaia e entorno em Guarulhos',
    matchTerms: ['cocaia', 'jardim cocaia', 'cocaia guarulhos'],
  },
  senac_jurubatuba: {
    key: 'senac_jurubatuba',
    label: 'Senac Jurubatuba (SP)',
    shortLabel: 'Senac Jurubatuba',
    badgeColor: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    borderLight: 'border-amber-300',
    textColor: 'text-amber-700',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Jurubatuba',
    defaultAddress: 'Av. Eng. Eusébio Stevaux, 823 (próx. Senac)',
    description: 'Pólo universitário, restaurantes, xerox e comércios no entorno do Senac Jurubatuba',
    matchTerms: ['senac', 'jurubatuba', 'senac jurubatuba', 'stevaux', 'nacoes unidas'],
  },
  maria_benedita_91: {
    key: 'maria_benedita_91',
    label: 'Rua Maria Benedita Rodrigues, 91 (SP)',
    shortLabel: 'Rua Maria Benedita, 91',
    badgeColor: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    borderLight: 'border-emerald-300',
    textColor: 'text-emerald-700',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'São Miguel / Ermelino',
    defaultAddress: 'Rua Maria Benedita Rodrigues, 91',
    description: 'Comércios, mercearias e depósitos no endereço específico e raio local imediato',
    matchTerms: ['maria benedita', 'maria benedita rodrigues', 'benedita rodrigues', 'rodrigues 91'],
  },
  copan_ipiranga: {
    key: 'copan_ipiranga',
    label: 'Copan & Alto do Ipiranga (SP)',
    shortLabel: 'Copan / Alto Ipiranga',
    badgeColor: 'bg-purple-500',
    bgLight: 'bg-purple-50',
    borderLight: 'border-purple-300',
    textColor: 'text-purple-700',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Centro / Alto do Ipiranga',
    defaultAddress: 'Av. Ipiranga, 200 (Copan) / Rua Santa Cruz (Alto do Ipiranga)',
    description: 'Galerias do Edifício Copan (Centro) e comércios do Alto do Ipiranga',
    matchTerms: ['copan', 'alto do ipiranga', 'edifício copan', 'ipiranga', 'santa cruz'],
  },
};

export const TARGET_LOCATION_KEYS = Object.keys(TARGET_LOCATIONS) as (keyof typeof TARGET_LOCATIONS)[];

/**
 * Identify if a lead belongs to one of the 4 target locations
 */
export function identifyLeadTargetRegion(lead: Lead): TargetLocationConfig | null {
  if (lead.targetRegionKey && TARGET_LOCATIONS[lead.targetRegionKey]) {
    return TARGET_LOCATIONS[lead.targetRegionKey];
  }

  const fullText = `${lead.businessName} ${lead.neighborhood} ${lead.address} ${lead.city} ${lead.salesNotes}`.toLowerCase();

  for (const loc of Object.values(TARGET_LOCATIONS)) {
    for (const term of loc.matchTerms) {
      if (fullText.includes(term.toLowerCase())) {
        return loc;
      }
    }
  }

  return null;
}

/**
 * Filter leads by target location filter mode
 */
export function filterLeadsByTargetLocation(
  lead: Lead,
  filterMode: 'all' | 'only_targets' | 'cocaia_guarulhos' | 'senac_jurubatuba' | 'maria_benedita_91' | 'copan_ipiranga'
): boolean {
  if (filterMode === 'all') return true;

  const detected = identifyLeadTargetRegion(lead);

  if (filterMode === 'only_targets') {
    return detected !== null;
  }

  return detected?.key === filterMode;
}
