import { Tier, TierItem } from '@/types/tierlist';

export const defaultTierColors = [
  '#ff7f7f', // S tier - Red
  '#ffbf7f', // A tier - Orange  
  '#ffff7f', // B tier - Yellow
  '#7fff7f', // C tier - Green
  '#7f7fff', // D tier - Blue
];

export const createDefaultTiers = (): Tier[] => [
  { id: 's-tier', label: 'S', color: defaultTierColors[0], items: [] },
  { id: 'a-tier', label: 'A', color: defaultTierColors[1], items: [] },
  { id: 'b-tier', label: 'B', color: defaultTierColors[2], items: [] },
  { id: 'c-tier', label: 'C', color: defaultTierColors[3], items: [] },
  { id: 'd-tier', label: 'D', color: defaultTierColors[4], items: [] },
];

export const moveItemBetweenTiers = (
  tiers: Tier[],
  item: TierItem,
  sourceTierId: string | null,
  targetTierId: string | null
): Tier[] => {
  return tiers.map(tier => {
    if (tier.id === sourceTierId) {
      // Remove item from source tier
      return {
        ...tier,
        items: tier.items.filter(i => i.id !== item.id)
      };
    } else if (tier.id === targetTierId) {
      // Add item to target tier
      return {
        ...tier,
        items: [...tier.items, item]
      };
    }
    return tier;
  });
};

export const removeItemFromTiers = (tiers: Tier[], itemId: string): Tier[] => {
  return tiers.map(tier => ({
    ...tier,
    items: tier.items.filter(item => item.id !== itemId)
  }));
};
