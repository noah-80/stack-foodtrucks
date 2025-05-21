import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import Section from "./Section";
import BarChartRace from './BarChartRace/BarChartRace';
import './BarChartRace/BarIndex.css';


const GridContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  // padding-top: 70px;
  overflow-y: auto;
`;

const BarsAndLineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const BarDivider = styled.div`
  width: 100%; /* matches Bar width since Bar is 100% of its container */
  border-bottom: 2px solid #CBCBCB;
  margin-bottom: clamp(5px, 0.8vw, 12px); /* space between line and label */
`;

const BarsBaselineWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(10px, 2vw, 20px);
  width: 100%;
  height: clamp(150px, 25vw, 300px);
  position: relative;
`;

const BarsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  gap: clamp(10px, 2vw, 20px);
  width: 100%;
  flex: 1 1 auto;
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
  font-family: 'Hanken Grotesk', sans-serif;
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
  // margin-top: 50px;
  margin-top: -4px;
  text-align: center;
  color: black;
  // font-family: 'Barlow', sans-serif;
  // font-size: clamp(14px, 2vw, 20px);
  // font-weight: 400;

  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 40px;
  // max-width: 800px;
  padding-top: 19px;
  padding-bottom: 21px;
  width: 100%;
  background-color: #DBDBDB;
`;

const HeaderImage = styled.img`
  position: absolute;
  left: 35px;
  height: 250px;
  width: auto;
  object-fit: contain;
`;

const HeaderSection = styled.div`
  width: calc(100% - clamp(35px, 5vw, 70px));
  height: clamp(44px, 8vw, 88px);
  background-color: #C9DE9D;
  border-radius: clamp(10px, 2vw, 20px);
  margin: clamp(25px, 4vw, 50px) clamp(17.5px, 2.5vw, 35px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    width: calc(100% - clamp(20px, 4vw, 40px));
    margin: clamp(20px, 3vw, 40px) clamp(10px, 2vw, 20px);
  }
`;

const HeaderText = styled.div`
  font-family: 'Barlow', sans-serif;
  font-size: clamp(16px, 3vw, 40px);
  font-weight: 800;
  color: black;
  text-align: center;
  padding: 0 clamp(10px, 2vw, 20px);
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;

  @media (max-width: 768px) {
    font-size: clamp(14px, 2.5vw, 32px);
  }
`;

const BodyText = styled.div`
  color: black;
  font-family: 'Hanken Grotesk', sans-serif;
//   font-size: clamp(12px, 2vw, 20px);
  // font-weight: 400;
  // line-height: 1.4;
  font-size: clamp(14px, 2vw, 28px);
  line-height: 1.2;
  font-weight: 400;
  margin: clamp(25px, 4vw, 50px) 175px;
  text-align: left;
  width: 65%;
`;

const HeaderImageLeft = styled.img`
  position: absolute;
  left: clamp(17.5px, 2.5vw, 35px);
  height: clamp(100px, 15vw, 250px);
  width: auto;
  object-fit: contain;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 768px) {
    height: clamp(120px, 18vw, 220px);
  }
`;

const HeaderImageRight = styled.img`
  position: absolute;
  right: clamp(17.5px, 2.5vw, 35px);
  height: clamp(100px, 15vw, 250px);
  width: auto;
  object-fit: contain;
  top: 50%;
  transform: translateY(-50%);

  @media (max-width: 768px) {
    height: clamp(120px, 18vw, 220px);
  }
`;

const HeaderTextItalic = styled(HeaderText)`
  font-style: italic;
  letter-spacing: -0.02em;
`;

const ThreeColumnSection = styled.div`
  display: flex;
  gap: clamp(15px, 3vw, 30px);
  margin: clamp(25px, 4vw, 50px) clamp(35px, 5vw, 70px);
  width: calc(100% - clamp(70px, 10vw, 140px));
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vw, 20px);
  position: relative;
`;

const ColumnTitle = styled.div`
  color: black;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
`;

const SmallerColumnTitle = styled(ColumnTitle)`
  font-size: clamp(12px, 1.8vw, 24px);
`;

const Dropdown = styled.select`
  width: 100%;
  padding: clamp(8px, 1.5vw, 12px);
  border: 2px solid #CBCBCB;
  border-radius: 20px;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(12px, 1.5vw, 24px);
  font-weight: 400;
  background-color: white;
  cursor: pointer;
`;

const ColumnImage = styled.img`
  width: 95%;
  height: auto;
  align-self: center;
  object-fit: contain;
  max-height: clamp(150px, 25vw, 500px);
`;

const StatsBox = styled.div`
  width: 100%;
  border: 2px solid #CBCBCB;
  border-radius: 20px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: clamp(10px, 4vw, 20px) clamp(10px, 2vw, 20px);
  gap: clamp(10px, 2vw, 20px);
  min-height: clamp(200px, 40vw, 400px);
  position: relative;
`;

const StatsBoxLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  border-bottom: 2px solid #CBCBCB;
  pointer-events: none;
  bottom:0;
`;

const BarWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width:100%;
  height: clamp(150px, 25vw, 300px);
`;

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
    justify-content: flex-end;
  width: clamp(80px, 15vw, 160px);
`;

const BarLabel = styled.div`
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(10px, 1.2vw, 20px);
  color: black;
  text-align: center;
  width: 100%;
  min-height: clamp(30px, 6vw, 60px);
  height: clamp(44px, 4vw, 48px);
  display: flex; 
  align-items: center;
  justify-content: center;
  padding: clamp(5px, 1vw, 10px) 0;
  overflow: hidden;
`;

const Bar = styled.div<{ height: number }>`
  width: clamp(12px, 2.5vw, 25px);
  height: ${props => props.height}%;
  min-height: 20px;
  background-color: #CBCBCB;
  transition: height 0.5s ease;
  position: relative;
  margin-bottom: clamp(10px, 2vw, 20px);
  margin-bottom: 0;
`;

const BarValue = styled.div`
  position: absolute;
  top: clamp(-30px, -3.5vw, -40px);
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(10px, 1.2vw, 20px);
  font-weight: 400;
  color: black;
  white-space: nowrap;
  width: max-content;
  text-align: center;
  padding-bottom: clamp(5px, 1vw, 10px);
  z-index: 1;
`;

interface TruckData {
  name: string;
  image: string;
  sales: number;
}

const TRUCK_DATA: TruckData[] = [
  { name: "8e8 Thai Street Food", image: "/image1.png", sales: 1697809 },
  { name: "Aloha Fridays", image: "/image2.png", sales: 929448 },
  { name: "BittieBitez Mini-Donuts", image: "/image3.png", sales: 669556.00 },
  { name: "Creamy Boys", image: "/image4.png", sales: 877343.00 },
  { name: "Dina's Dumpling", image: "/image5.png", sales: 676228 },
  { name: "Flamin' Hot Chicken", image: "/image6.png", sales: 420001 },
  { name: "Habibi Shack", image: "/image7.png", sales: 353196.00 },
  { name: "Kalamaki Greek Street Food", image: "/image8.png", sales: 599551 },
  { name: "Perro 1-10 Tacos", image: "/image9.png", sales: 1472433 },
  { name: "Pinch of Flavor", image: "/image10.png", sales: 838716 },
  { name: "Salpicon", image: "/image11.png", sales: 1231522 },
  { name: "Smile Hotdog", image: "/image12.png", sales: 954465.00 },
  { name: "StopBye Cafe", image: "/image13.png", sales: 536844.00 },
  { name: "The Taco Cartel", image: "/image14.png", sales: 556608.00 },
  { name: "Uncle Al's BBQ", image: "/image15.png", sales: 301097.00 },
  { name: "Cerda Vega Tacos", image: "/image16.png", sales: 644553.00 },
  { name: "Wafl", image: "/image17.png", sales: 572072.00 },
  { name: "Yuna's Bob", image: "/image18.png", sales: 553192.00 },
  { name: "Dulce Europa Shaved Ice", image: "/image19.png", sales: 288440 },
  { name: "DD's Chick & Cat Shack", image: "/image20.png", sales: 270972.00 }
];

const formatCurrency = (value: number) => {
  // Check if the number has any decimal places
  const hasDecimals = value % 1 !== 0;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  }).format(value);
};

const GridPage = () => {
  const [hoveredCells, setHoveredCells] = useState<Set<number>>(new Set());
  const [images, setImages] = useState<string[]>([]);
  const [selectedTruck1, setSelectedTruck1] = useState<string>("");
  const [selectedTruck2, setSelectedTruck2] = useState<string>("");

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
          <img src={images[index]} />
        )}
      </GridCell>
    );
  };

  const handleTruck1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value !== selectedTruck2) {
      setSelectedTruck1(value);
    }
  };

  const handleTruck2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value !== selectedTruck1) {
      setSelectedTruck2(value);
    }
  };

  const getTruckData = (name: string) => {
    return TRUCK_DATA.find(truck => truck.name === name);
  };

  const getMaxSales = () => {
    return Math.max(...TRUCK_DATA.map(truck => truck.sales));
  };

  const calculateBarHeight = (sales: number) => {
    const maxSales = getMaxSales();
    // Reduce the maximum height to 60% to leave more room for the value and spacing
    return (sales / maxSales) * 60;
  };

  return (
    <GridContainer>
      <Grid>
        {Array.from({ length: 13 * 6 }).map((_, index) => renderCell(index))}
      </Grid>
      <CreditsContainer>
        Reporting by Noah Hrung, Chloe Kim, and Liam McGlynn
        {/* <br />
        Development by [contributors]
        <br />
        Design & Illustration by Noah Hrung */}
      </CreditsContainer>
      <HeaderSection>
        <HeaderImageLeft src="/image11.png" alt="Header decoration" />
        <HeaderText>Rolling into Campus</HeaderText>
      </HeaderSection>
      <BodyText>
      UCLA Dining prides itself on serving the best food across college campuses, defending its #1 placement in the Niche Best College Food in America ranking for over half a decade.

But the UCLA Dining experience extends beyond the traditional college dining hall experience, tapping into Los Angeles food truck culture through contracting a variety of food trucks. From international flavors to late night sweets, students exchange a meal swipe valued at $9 for a food truck's take-out meal.
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#FCBFD6' }}>
        <HeaderImageRight src="/image4.png" alt="Header decoration" />
        <HeaderText>Food Truck Performance</HeaderText>
      </HeaderSection>
      <BodyText>
      From September 2022 to December 2024, a total of 66 different food trucks have visited UCLA. These are the top five food trucks based on average sales per visit for the 2022-2023 and 2023-2024 academic years:
      </BodyText>
      <Section>
        <div style={{ 
          width: "1200px", 
          margin: "0 auto", 
          padding: "20px",
          background: "white"
        }}>
          <BarChartRace />
        </div>
      </Section>
      


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
          <Dropdown value={selectedTruck1} onChange={handleTruck1Change}>
            <option value="">Select a truck</option>
            {[...TRUCK_DATA]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(truck => (
                <option key={truck.name} value={truck.name} disabled={truck.name === selectedTruck2}>
                  {truck.name}
                </option>
              ))}
          </Dropdown>
          {selectedTruck1 && (
            <ColumnImage src={getTruckData(selectedTruck1)?.image} alt={selectedTruck1} />
          )}
        </Column>
        <Column>
          <SmallerColumnTitle>All-time Sales (Fall 2022 - Fall 2024)</SmallerColumnTitle>
          <StatsBox>
  <BarsAndLineWrapper>
    <BarsBaselineWrapper>
      {selectedTruck1 && (
        <BarWrapper>
          <Bar height={calculateBarHeight(getTruckData(selectedTruck1)?.sales || 0)}>
            <BarValue>{formatCurrency(getTruckData(selectedTruck1)?.sales || 0)}</BarValue>
          </Bar>
        </BarWrapper>
      )}
      {selectedTruck2 && (
        <BarWrapper>
          <Bar height={calculateBarHeight(getTruckData(selectedTruck2)?.sales || 0)}>
            <BarValue>{formatCurrency(getTruckData(selectedTruck2)?.sales || 0)}</BarValue>
          </Bar>
        </BarWrapper>
      )}
      {(selectedTruck1 || selectedTruck2) && <StatsBoxLine />}
    </BarsBaselineWrapper>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(10px, 2vw, 20px)', width: '100%' }}>
      {selectedTruck1 && <BarLabel>{selectedTruck1}</BarLabel>}
      {selectedTruck2 && <BarLabel>{selectedTruck2}</BarLabel>}
    </div>
  </BarsAndLineWrapper>
</StatsBox>

        </Column>
        <Column>
          <ColumnTitle>TRUCK 2</ColumnTitle>
          <Dropdown value={selectedTruck2} onChange={handleTruck2Change}>
            <option value="">Select a truck</option>
            {[...TRUCK_DATA]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(truck => (
                <option key={truck.name} value={truck.name} disabled={truck.name === selectedTruck1}>
                  {truck.name}
                </option>
              ))}
          </Dropdown>
          {selectedTruck2 && (
            <ColumnImage src={getTruckData(selectedTruck2)?.image} alt={selectedTruck2} />
          )}
        </Column>
      </ThreeColumnSection>
      <HeaderSection style={{ backgroundColor: '#BFDDFC' }}>
        <HeaderImageLeft src="/image3.png" alt="Header decoration" />
        <HeaderText>The Fate of Food Trucks</HeaderText>
      </HeaderSection>
      <BodyText>
      Decrease in food trucks is most evident when looking at the number of food trucks in a given day's Dinner meal period. During Fall Quarter 2023, the number of food trucks during a single Dinner meal period maxed out at six food trucks. By the following Winter and Spring Quarters during the 2023-2024 academic year, this number was halved, with a maximum of three food trucks visiting during a single day's Dinner meal period. During Fall Quarter 2024, a new peak of four food trucks was reached on 6 days, though a vast majority of days only received two food trucks.
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#FBAD79' }}>
        <HeaderImageRight src="/image1.png" alt="Header decoration" />
        <HeaderText>Food for Thought</HeaderText>
      </HeaderSection>
      <BodyText>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#EBB1EE' }}>
        <HeaderImageLeft src="/image5.png" alt="Header decoration" style={{ height: 'clamp(150px, 25vw, 300px)' }} />
        <HeaderText>About the Data</HeaderText>
      </HeaderSection>
      <BodyText>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </BodyText>
      <CreditsContainer style={{ fontStyle: 'italic', marginBottom: '0px' }}>
        Contributing reports from Sydney Tomsick and Cassidy Sadowski, Stack contributors.
      </CreditsContainer>
      <BodyText></BodyText>
    </GridContainer>
  );
};

export default GridPage; 