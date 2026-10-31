import React from 'react';
import { PageBlock } from '../../types';
import { VisualBlockRenderer } from './VisualBlockRenderer';

interface BlockCanvasProps {
  blocks: PageBlock[];
}

export const BlockCanvas: React.FC<BlockCanvasProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  // Sort blocks by sort_order
  const sortedBlocks = [...blocks].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="w-full">
      {sortedBlocks.map((block) => (
        <VisualBlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};
