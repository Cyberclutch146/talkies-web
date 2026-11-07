'use client';

import { useState, useEffect, useCallback } from 'react';
import DriftWall from './ReactBitsDriftWall';
import {
  DriftWallCategory,
  CATEGORY_ITEMS,
  type DriftWallCategoryItem,
} from '../../data/driftWallCategories';

/**
 * CategoryDriftWallOverlay - Shows a DriftWall overlay when category anchors are clicked.
 * 
 * Anchors should have href="#category-{category}" format, e.g.:
 *   <a href="#category-performances">Performances</a>
 * 
 * When clicked, the DriftWall displays images from the selected category.
 * 
 * Props:
 *   category: The currently selected category (from parent state)
 *   onClose: Callback when the overlay should be closed
 */
export interface CategoryDriftWallOverlayProps {
  category?: 'performances' | 'inauguration' | 'audience' | 'prize-distribution';
  onClose: () => void;
}

/**
 * CategoryDriftWallOverlay - Shows a DriftWall overlay when category anchors are clicked.
 * 
 * Anchors should have href="#category-{category}" format, e.g.:
 *   <a href="#category-performances">Performances</a>
 * 
 * When clicked, the DriftWall displays images from the selected category.
 */
export function CategoryDriftWallOverlay({ category, onClose }: CategoryDriftWallOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<DriftWallCategoryItem[]>([]);

  // Initialize items when category changes (from parent prop)
  useEffect(() => {
    if (category) {
      setItems(CATEGORY_ITEMS[category]);
      setVisible(true);
    } else {
      setVisible(false);
      setItems([]);
    }
  }, [category]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!visible || !items.length) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative bg-[#14120e] w-full max-w-6xl max-h-[80vh] rounded-lg overflow-hidden shadow-2xl transform transition-transform duration-500 ease-out" style={{ transform: visible ? 'scale(1)' : 'scale(0)' }}>
        <DriftWall
          items={items}
          columns={5}
          tileWidth={200}
          tileHeight={132}
          gap={18}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={42}
          direction="up"
          variance={0.45}
          parallax={0.6}
          lift={64}
          fade={0.6}
          dim={0.55}
          overlayColor="#060010"
          className="drift-wall-overlay"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-[#d4a24e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4a24e]"
          aria-label="Close overlay"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Category anchors component - provides anchor links for each category.
 * Use these anchors in your page with href="#category-{category}" format.
 * Calls onCategoryClick when clicked to select the category for the DriftWall overlay.
 */
export function CategoryAnchors<Category extends 'performances' | 'inauguration' | 'audience' | 'prize-distribution'>({ onCategoryClick, selectedCategory }: { onCategoryClick: (category: Category) => void; selectedCategory?: Category }) {
  const categories = [
    { key: 'performances', label: 'Performances' },
    { key: 'inauguration', label: 'Inauguration' },
    { key: 'audience', label: 'Audience' },
    { key: 'prize-distribution', label: 'Prize Distribution' },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-[#d4a24e] mb-4">Agomoni Categories</h3>
      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ key, label }) => (
          <a
            key={key}
            href={`#category-${key}`}
            className={`block rounded-md bg-${selectedCategory === key ? '#d4a24e' : '#14120e'} text-${selectedCategory === key ? '#14120e' : '#d4a24e'} px-4 py-2 text-sm font-medium hover:bg-${selectedCategory === key ? '#c83a1a' : '#d4a24e'} transition-colors`}
            onClick={(e) => {
              e.preventDefault();
              onCategoryClick(key as Category);
            }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}