export type CenterBranding = {
  id?: number;
  name: string;
  shortName: string;
  logoUrl: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export const DEFAULT_CENTER_BRANDING: CenterBranding = {
  name: 'MK Academy',
  shortName: 'MK Academy',
  logoUrl:
    'https://res.cloudinary.com/dpfbu9aid/image/upload/v1775282809/academy_kaomaq.jpg',
  description:
    "Ingliz tilini CEFR standarti bo'yicha noldan professional darajagacha o'rganish platformasi.",
};

export function normalizeCenterBranding(
  input?: Partial<CenterBranding> | null,
): CenterBranding {
  return {
    id: input?.id,
    name: input?.name?.trim() || DEFAULT_CENTER_BRANDING.name,
    shortName:
      input?.shortName?.trim() ||
      input?.name?.trim() ||
      DEFAULT_CENTER_BRANDING.shortName,
    logoUrl: input?.logoUrl?.trim() || DEFAULT_CENTER_BRANDING.logoUrl,
    description:
      input?.description?.trim() || DEFAULT_CENTER_BRANDING.description,
    createdAt: input?.createdAt,
    updatedAt: input?.updatedAt,
  };
}
