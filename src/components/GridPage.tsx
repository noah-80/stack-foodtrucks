import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const GridContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(13, 1fr);
  grid-template-rows: repeat(6, 1fr);
  width: 100%;
  aspect-ratio: 13/6;
  border: 2px solid #DBDBDB;
`;

const GridCell = styled.div<{ isHovered: boolean; isMerged?: boolean }>`
  border: 2px solid #DBDBDB;
  position: relative;
  transition: background-color 0.3s ease;
  background-color: ${props => props.isHovered ? '#DBDBDB' : 'transparent'};
  aspect-ratio: ${props => props.isMerged ? '5/2' : '1'};
  grid-column: ${props => props.isMerged ? 'span 5' : 'auto'};
  grid-row: ${props => props.isMerged ? 'span 2' : 'auto'};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    max-width: 95%;
    max-height: 95%;
    width: auto;
    height: auto;
    object-fit: contain;
    opacity: ${props => props.isHovered ? 0 : 1};
    transition: opacity 0.3s ease;
    display: block;
  }
`;

const TitleText = styled.div`
  text-align: center;
  color: black;
  font-family: 'Barlow', sans-serif;
  font-size: clamp(20px, 3vw, 40px);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const SubtitleText = styled.div`
  text-align: center;
  color: black;
  font-family: 'Almanach Test', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(0.5rem, 1vw, 1rem);
  width: 100%;
  height: 100%;
`;

const GridPage = () => {
  const [hoveredCells, setHoveredCells] = useState<Set<number>>(new Set());
  const [images, setImages] = useState<string[]>([]);

  const getAdjacentIndices = (index: number, cols: number, rows: number): number[] => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const adjacent: number[] = [];

    // Check all 8 directions
    const directions = [
      [-1, -1], [0, -1], [1, -1],  // Top-left, Top, Top-right
      [-1, 0],           [1, 0],   // Left, Right
      [-1, 1],  [0, 1],  [1, 1]    // Bottom-left, Bottom, Bottom-right
    ];

    for (const [dx, dy] of directions) {
      const newCol = col + dx;
      const newRow = row + dy;
      if (newCol >= 0 && newCol < cols && newRow >= 0 && newRow < rows) {
        adjacent.push(newRow * cols + newCol);
      }
    }

    return adjacent;
  };

  useEffect(() => {
    const cols = 13;
    const rows = 6;
    const totalCells = cols * rows;
    const randomImages: string[] = [];

    for (let i = 0; i < totalCells; i++) {
      const adjacentIndices = getAdjacentIndices(i, cols, rows);
      const usedImages = new Set(adjacentIndices.map(idx => randomImages[idx]));
      
      let randomNum;
      do {
        randomNum = Math.floor(Math.random() * 18) + 1;
      } while (usedImages.has(`/image${randomNum}.png`));
      
      randomImages.push(`/image${randomNum}.png`);
    }

    setImages(randomImages);
  }, []);

  const handleMouseEnter = (index: number) => {
    // Don't add hover effect for merged cell
    if (index >= 30 && index <= 34 || index >= 43 && index <= 47) {
      return;
    }

    setHoveredCells(prev => new Set([...prev, index]));
    
    // Remove the cell from hovered cells after 5 seconds
    setTimeout(() => {
      setHoveredCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 1000);
  };

  const renderCell = (index: number) => {
    // Check if this cell is part of the merged area
    const isMergedCell = index >= 30 && index <= 34 || index >= 43 && index <= 47;
    
    // Only render the first cell of the merged area
    if (isMergedCell && index !== 30) {
      return null;
    }

    return (
      <GridCell
        key={index}
        isHovered={hoveredCells.has(index)}
        onMouseEnter={() => handleMouseEnter(index)}
        isMerged={index === 30}
      >
        {isMergedCell ? (
          <TextContainer>
            <TitleText>Beyond the Dining Hall:</TitleText>
            <SubtitleText>A Data-Driven Look at UCLA's Food Trucks</SubtitleText>
          </TextContainer>
        ) : (
          <img src={images[index]} alt={`Grid cell ${index + 1}`} />
        )}
      </GridCell>
    );
  };

  return (
    <GridContainer>
      <Grid>
        {Array.from({ length: 13 * 6 }).map((_, index) => renderCell(index))}
      </Grid>
    </GridContainer>
  );
};

export default GridPage; 