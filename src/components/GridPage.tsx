import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const GridContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-top: 70px;
  overflow-y: auto;
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
  font-weight: 800;
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

const CreditsContainer = styled.div`
  margin-top: 50px;
  text-align: center;
  color: black;
  font-family: 'Almanach Test', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 50px;
  max-width: 800px;
  padding: 0 20px;
`;

const HeaderImage = styled.img`
  position: absolute;
  left: 35px;
  height: 250px;
  width: auto;
  object-fit: contain;
`;

const HeaderSection = styled.div`
  width: calc(100% - 70px);
  height: clamp(44px, 8vw, 88px);
  background-color: #C9DE9D;
  border-radius: 20px;
  margin: clamp(25px, 4vw, 50px) 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const HeaderText = styled.div`
  font-family: 'Barlow', sans-serif;
  font-size: clamp(20px, 4vw, 40px);
  font-weight: 800;
  color: black;
`;

const BodyText = styled.div`
  color: black;
  font-family: 'Almanach Test', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
  margin: clamp(25px, 4vw, 50px) 175px;
  text-align: left;
`;

const HeaderImageLeft = styled.img`
  position: absolute;
  left: clamp(17.5px, 2.5vw, 35px);
  height: clamp(125px, 20vw, 250px);
  width: auto;
  object-fit: contain;
`;

const HeaderImageRight = styled.img`
  position: absolute;
  right: clamp(17.5px, 2.5vw, 35px);
  height: clamp(125px, 20vw, 250px);
  width: auto;
  object-fit: contain;
`;

const HeaderTextItalic = styled(HeaderText)`
  font-style: italic;
`;

const ThreeColumnSection = styled.div`
  display: flex;
  gap: 25px;
  margin: clamp(25px, 4vw, 50px) 175px;
  width: calc(100% - 350px);
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(12.5px, 2vw, 25px);
  position: relative;
`;

const ColumnTitle = styled.div`
  color: black;
  font-family: 'Almanach Test', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid #CBCBCB;
  border-radius: 20px;
  font-family: 'Almanach Test', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  background-color: white;
  cursor: pointer;
`;

const ColumnImage = styled.img`
  width: 90%;
  height: auto;
  align-self: center;
  object-fit: contain;
`;

const StatsBox = styled.div`
  width: 100%;
  border: 2px solid #CBCBCB;
  border-radius: 20px;
  flex-grow: 1;
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
        randomNum = Math.floor(Math.random() * 20) + 1;
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
      <CreditsContainer>
        Reporting by Chloe Kim, Liam McGlynn, and Noah Hrung
        <br />
        Development by [contributors]
        <br />
        Design & Illustration by Noah Hrung
      </CreditsContainer>
      <HeaderSection>
        <HeaderImageLeft src="/image11.png" alt="Header decoration" />
        <HeaderText>Intro</HeaderText>
      </HeaderSection>
      <BodyText>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#FCBFD6' }}>
        <HeaderImageRight src="/image4.png" alt="Header decoration" />
        <HeaderText>Individual Performance</HeaderText>
      </HeaderSection>
      <BodyText>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#BFDDFC' }}>
        <HeaderImageLeft src="/image3.png" alt="Header decoration" />
        <HeaderText>Phasing Out</HeaderText>
      </HeaderSection>
      <BodyText>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#EDDCAE' }}>
        <HeaderImageLeft src="/image12.png" alt="Header decoration" />
        <HeaderImageRight src="/image9.png" alt="Header decoration" />
        <HeaderTextItalic>FOOD TRUCK SHOWDOWN!</HeaderTextItalic>
      </HeaderSection>
      <BodyText>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.
      </BodyText>
      <ThreeColumnSection>
        <Column>
          <ColumnTitle>TRUCK 1</ColumnTitle>
          <Dropdown>
            <option value="">Select a truck</option>
          </Dropdown>
          <ColumnImage src="/image13.png" alt="Truck 1" />
        </Column>
        <Column>
          <ColumnTitle>Average $ / Visit</ColumnTitle>
          <StatsBox />
        </Column>
        <Column>
          <ColumnTitle>TRUCK 2</ColumnTitle>
          <Dropdown>
            <option value="">Select a truck</option>
          </Dropdown>
          <ColumnImage src="/image17.png" alt="Truck 2" />
        </Column>
      </ThreeColumnSection>
    </GridContainer>
  );
};

export default GridPage; 