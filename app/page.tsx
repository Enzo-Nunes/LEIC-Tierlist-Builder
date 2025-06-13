'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface TierItem {
  id: string;
  name: string;
  image?: string;
}

interface Tier {
  id: string;
  label: string;
  color: string;
  items: TierItem[];
}

const initialItems: TierItem[] = [
  { id: '1', name: 'Computer Science' },
  { id: '2', name: 'Electrical Engineering' },
  { id: '3', name: 'Mechanical Engineering' },
  { id: '4', name: 'Civil Engineering' },
  { id: '5', name: 'Chemical Engineering' },
  { id: '6', name: 'Mathematics' },
  { id: '7', name: 'Physics' },
  { id: '8', name: 'Chemistry' },
];

const initialTiers: Tier[] = [
  { id: 'S', label: 'S', color: '#ff7f7f', items: [] },
  { id: 'A', label: 'A', color: '#ffbf7f', items: [] },
  { id: 'B', label: 'B', color: '#ffff7f', items: [] },
  { id: 'C', label: 'C', color: '#bfff7f', items: [] },
  { id: 'D', label: 'D', color: '#7fff7f', items: [] },
  { id: 'F', label: 'F', color: '#7f7fff', items: [] },
];

export default function Home() {
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [unrankedItems, setUnrankedItems] = useState<TierItem[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<TierItem | null>(null);

  const handleDragStart = (e: React.DragEvent, item: TierItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTierId: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Remove item from its current location
    setTiers(prev => prev.map(tier => ({
      ...tier,
      items: tier.items.filter(item => item.id !== draggedItem.id)
    })));
    
    setUnrankedItems(prev => prev.filter(item => item.id !== draggedItem.id));

    // Add item to target tier
    if (targetTierId === 'unranked') {
      setUnrankedItems(prev => [...prev, draggedItem]);
    } else {
      setTiers(prev => prev.map(tier => 
        tier.id === targetTierId 
          ? { ...tier, items: [...tier.items, draggedItem] }
          : tier
      ));
    }

    setDraggedItem(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>LEIC Program Tierlist</h1>
        <p>Rank your college undergraduate programs!</p>
      </header>

      <main className={styles.main}>
        <div className={styles.tierlist}>
          {tiers.map(tier => (
            <div key={tier.id} className={styles.tierRow}>
              <div 
                className={styles.tierLabel}
                style={{ backgroundColor: tier.color }}
              >
                {tier.label}
              </div>
              <div 
                className={styles.tierItems}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, tier.id)}
              >
                {tier.items.map(item => (
                  <div
                    key={item.id}
                    className={styles.tierItem}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.unranked}>
          <h3>Unranked Items</h3>
          <div 
            className={styles.unrankedItems}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'unranked')}
          >
            {unrankedItems.map(item => (
              <div
                key={item.id}
                className={styles.tierItem}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Built for LEIC graduates 🎓</p>
      </footer>
    </div>
  );
}
