export interface TierItem {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

export interface Tier {
  id: string;
  label: string;
  color: string;
  items: TierItem[];
}

export interface TierlistData {
  id: string;
  title: string;
  description?: string;
  tiers: Tier[];
  availableItems: TierItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type DragItem = {
  type: 'TIER_ITEM';
  item: TierItem;
  sourceType: 'tier' | 'available';
  sourceTierId?: string;
};
