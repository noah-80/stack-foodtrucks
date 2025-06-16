import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import styled from '@emotion/styled';
import Section from "./Section";
import BarChartRace from './BarChartRace/BarChartRace';
import './BarChartRace/BarIndex.css';
import Correlation from './Correlation';
import InactiveChart from './InactiveChart';
import AvailabilityChart from './AvailabilityChart';
import WeeklyChart from './WeeklyChart';
import top20 from '../Img/Top20.png';
import trucks from '../Img/Trucks.png';

import image1 from '../Img/image1.png';
import image2 from '../Img/image2.png';
import image3 from '../Img/image3.png';
import image4 from '../Img/image4.png';
import image5 from '../Img/image5.png';
import image6 from '../Img/image6.png';
import image7 from '../Img/image7.png';
import image8 from '../Img/image8.png';
import image9 from '../Img/image9.png';
import image10 from '../Img/image10.png';
import image11 from '../Img/image11.png';
import image12 from '../Img/image12.png';
import image13 from '../Img/image13.png';
import image14 from '../Img/image14.png';
import image15 from '../Img/image15.png';
import image16 from '../Img/image16.png';
import image17 from '../Img/image17.png';
import image18 from '../Img/image18.png';
import image19 from '../Img/image19.png';
import image20 from '../Img/Poutine.png';
import image21 from '../Img/Cookie.png';
import image22 from '../Img/imagenew.png';

import i1 from '../Img/1.png';
import i2 from '../Img/2.png';
import i3 from '../Img/3.png';
import i4 from '../Img/4.png';
import i5 from '../Img/5.png';
import i6 from '../Img/6.png';
import i7 from '../Img/7.png';
import i8 from '../Img/8.png';

import top20Mobile from '../Img/Top20Mobile.png';
import dinnerDecrease from '../Img/dinnerDecrease.png';


const GridContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
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
  border: 0.1em solid #DBDBDB;
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
  color: rgb(39, 39, 39);
  font-family: 'Barlow', sans-serif;
  font-size: clamp(12px, 3vw, 40px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.3rem;
  letter-spacing: -0.02em;
    @media (max-width: 360px) {
    font-size: 8px;
  }
`;

const SubtitleText = styled.div`
  text-align: center;
  color: rgb(39, 39, 39);
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(12px, 2vw, 28px);
  font-weight: 400;
  line-height: 1.2;
    @media (max-width: 360px) {
    font-size: 8px;
  }
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
  padding-left: 20px;
  padding-right: 20px;
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
  color: rgb(39, 39, 39);
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
  color:rgb(39, 39, 39);
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: clamp(14px, 2vw, 20px);
  line-height: 1.5em;
  font-weight: 400;
  margin-left: clamp(20px, 4vw, 10%);
  margin-right: clamp(20px, 4vw, 10%);
  text-align: left;
  width: 60vw;
  z-index: 99;
  @media (max-width: 768px) {
    width: 80vw;
  }

  img {
    width: 100%;
    height: auto;
    margin: clamp(20px, 3vw, 40px) 0;
    display: block;
  }
`;

const CenteredBodyText = styled(BodyText)`
  text-align: center;
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
    left: -20px;
  }

  @media (max-width: 440px) {
    height: clamp(80px, 15vw, 120px);
    left: -10px;
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
    right: -20px;
  }

  @media (max-width: 440px) {
    height: clamp(80px, 15vw, 120px);
    right: -10px;
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
  font-family: 'Barlow', sans-serif;
  font-size: clamp(14px, 2vw, 28px);
  font-weight: 800;
  line-height: 1.2;
  text-align: center;
`;

const SmallerColumnTitle = styled(ColumnTitle)`
  font-size: 1.5vw;
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

const FullWidthImageWrapper = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  display: flex;
  justify-content: center;
  background-color: white;
  overflow-x: hidden;

  @media (max-width: 768px) {
    width: 100%;
    overflow-x: hidden;
  }
`;

const FullWidthImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 100vw;
  content: {top20};
  margin: 0;

  @media (max-width: 768px) {
    content: {top20Mobile};
    width: 100%;
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
`;

const FullWidthGreySection = styled.div`
  width: 100%;
  max-width: 100%;
  background-color: #DBDBDB;
  padding: clamp(50px, 10vw, 100px) 0 clamp(40px, 8vw, 80px) 0;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin: 0;
  position: relative;
  box-sizing: border-box;
`;

const GreySectionImage = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  height: clamp(100px, 15vw, 250px);
  width: auto;
  object-fit: contain;

  @media (max-width: 768px) {
    height: clamp(120px, 18vw, 220px);
  }
`;

const GreySectionTitle = styled(TitleText)`
  margin-bottom: clamp(20px, 4vw, 40px);
`;

const GreySectionText = styled(BodyText)`
  margin: 0 auto;
  text-align: left;
  width: min(800px, 90vw);
`;

interface TruckData {
  name: string;
  image: string;
  sales: number;
}

const TRUCK_DATA: TruckData[] = [
  { name: "8E8 Thai Street Food", image: image1, sales: 159928 },
  { name: "Perro 1-10 Tacos", image: image9, sales: 141064 },
  { name: "Salpicon", image: image11, sales: 109679 },
  { name: "Aloha Fridays", image: image2, sales: 93387 },
  { name: "Smile Hotdog", image: image12, sales: 91440 },
  { name: "Creamy Boys", image: image4, sales: 80032 },
  { name: "Pinch of Flavor", image: image10, sales: 79432 },
  { name: "Dina's Dumpling", image: image5, sales: 72623 },
  { name: "Cerda Vega Tacos", image: image16, sales: 65050 },
  { name: "BittieBitez Mini-Donuts", image: image3, sales: 61013 },
  { name: "Kalamaki Greek Street Food", image: image8, sales: 59409 },
  { name: "Wafl", image: image17, sales: 57724 },
  { name: "Yuna's Bob", image: image18, sales: 54997 },
  { name: "The Taco Cartel", image: image14, sales: 53978 },
  { name: "StopBye Cafe", image: image13, sales: 53300 },
  { name: "Flamin' Hot Chicken", image: image6, sales: 42913 },
  { name: "Habibi Shack", image: image7, sales: 34416 },
  { name: "Dulce Europa Shaved Ice", image: image19, sales: 31604 },
  { name: "Uncle Al's BBQ", image: image15, sales: 30372 },
  { name: "Poutine Brothers", image: image20, sales: 24253 }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(value);
};

const LargeHeaderImageLeft = styled(HeaderImageLeft)`
  height: clamp(150px, 25vw, 300px);

  @media (max-width: 440px) {
    height: clamp(110px, 15vw, 150px);
    left: -30px;
  }
`;

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
    
    // Define all possible images including the new ones
    const allImages = [image1, image2, image3, image4, image5, image6, image7, image8,
      image9, image10, image11, image12, image13, image14, image15, image16,
      image17, image18, image19, image20, image21, image22];
    // const allImages = [
    //   ...Array.from({ length: 19 }, (_, i) => `./Img/image${i + 1}.png`),
    //   '/Poutine.png',
    //   '/Cookie.png',
    //   '/imagenew.png'
    // ];

    for (let i = 0; i < totalCells; i++) {
      const adjacentIndices = getAdjacentIndices(i, cols, rows);
      const usedImages = new Set(adjacentIndices.map(idx => randomImages[idx]));
      
      let randomImage;
      do {
        randomImage = allImages[Math.floor(Math.random() * allImages.length)];
      } while (usedImages.has(randomImage));
      
      randomImages.push(randomImage);
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

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const handleResize = () => setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleResize);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  return (
    <GridContainer>
      <Grid>
        {Array.from({ length: 13 * 6 }).map((_, index) => renderCell(index))}
      </Grid>
      <CreditsContainer>
        Reporting by Noah Hrung, Chloe Kim and Liam McGlynn
        {/* <br />
        Development by [contributors]
        <br />
        Design & Illustration by Noah Hrung */}
      </CreditsContainer>
      {/* <InactiveChart />
      <AvailabilityChart />
      <WeeklyChart /> */}
      <HeaderSection>
        <HeaderImageLeft src={i8} alt="Header decoration" />
        <HeaderText>Rolling into Campus</HeaderText>
      </HeaderSection>
      <BodyText>
        For over half a decade, UCLA has defended its #1 placement in the Niche Best College Food in America ranking. The UCLA Dining experience, however, extends beyond traditional college dining halls. Tapping into Los Angeles food truck culture, UCLA Dining invites a variety of food trucks onto campus. From international flavors to late-night sweets, students can exchange a meal swipe for take-out meals at food trucks.<br></br>
        
        <img src={trucks} alt="An assortment of UCLA's food truck offerings." style={{ marginTop: "0px" }} />
        

        "I think it's good because it gets to show a little slice of LA in terms of cuisine," fourth-year labor studies student Jason Xavier Osorio said. "It's just marvelous to see how LA has come to evolve with the food truck business." <br></br><br></br>

        Following students' return to on-campus housing in 2021, UCLA introduced food trucks to temporarily address staffing shortages and to alleviate lines on the Hill. In the 2022-2023 school year, around 18% of dining swipes that were used on the Hill were used on food trucks, making them more popular than any take-out location on the Hill. 
      </BodyText>
      <WeeklyChart/>
      <BodyText>
        Throughout the past few years, food trucks have served a steady supply of students. However, in the time since they first arrived, their future role on campus has come under question. Cynthia Ho, a second-year mechanical engineering student and former On-Campus Housing Council Representative, described some of the conversations held between UCLA Dining, the OCHC and residents.<br></br><br></br>

        "We actually talked about the phasing out of food trucks, and there were a lot of people frustrated," Ho said. "Ever since COVID, we had to lay off a lot of staff. The money that would've been going to that staff is now going to the food trucks instead. As we're going back to our pre-COVID levels, we're able to hire more people, but that means the money will have to be shifted to these new dining staff hires." 
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#FCBFD6' }}>
        <HeaderImageRight src={i4} alt="Header decoration" />
        <HeaderText>Food Truck Performance</HeaderText>
      </HeaderSection>
      <BodyText>
        From September 2022 to December 2024, over 65 food trucks served UCLA students on the Hill. These are the top five food trucks based on average swipes per hour for the 2022-2023 and 2023-2024 academic years:
      </BodyText>
      <BarChartRace />
      <BodyText>
        In both the 2022-23 and 2023-24 academic years, <a target="_blank" href='https://dailybruin.com/2024/04/16/8e8-thai-street-foods-rise-to-the-top-of-the-ucla-food-truck-chain'>8E8 Thai Street Food</a> held the crown as UCLA's most popular food truck, having raked in the highest total number of meal swipes each year.<br></br><br></br>

        However, when it comes to average swipes per hour, Aloha Fridays ranked first in the 2022-2023 academic year. In the following 2023-2024 academic year, Aloha Fridays dropped six positions to rank seventh.<br></br><br></br>

        8E8 Thai Street Food ranked third in the 2022-2023 academic year but rose two positions to rank first the following year.<br></br><br></br>

        Salpicon, the most popular <a target="_blank" href='https://dailybruin.com/2024/01/16/dessert-food-trucks'>dessert food truck</a> known for its açaí bowls, rose two positions to become second on the list.<br></br><br></br>

        Dina's Dumpling ranked second in average swipes per hour during the 2022-2023 academic year. In the 2023-2024 academic year, it dropped two positions to rank fourth. During spring 2024, it did not visit UCLA. Dina's Dumpling never returned to campus in the 2024-2025 school year.<br></br><br></br>

        Paradise Cookies & Ice Cream ranked fifth in the 2022-2023 academic year but became inactive by the following 2023-2024 academic year.<br></br><br></br>

        Dulce Europa Shaved Ice rose nine positions from the previous year to rank third, and Perro 1-10 Tacos rose five positions to rank fifth the 2023-2024 academic year. 

        <FullWidthImageWrapper>
          <FullWidthImage
            src={isMobile ? top20Mobile : top20}
            alt="Top 20 food trucks, based off all-time swipes (Fall 2022 - Fall 2024)"
            style={{ marginTop: '-10px' }}
          />
        </FullWidthImageWrapper>
      </BodyText>
        <BodyText>
        For successful food trucks, there is a positive correlation between average swipes per hour and the total number of hours spent at UCLA, where frequently returning food trucks tend to be more efficient than others. 
        </BodyText>
        <Correlation/>
      <HeaderSection style={{ backgroundColor: '#EDDCAE' }}>
        <HeaderImageLeft src={i7} alt="Header decoration" />
        <HeaderImageRight src={i6} alt="Header decoration" />
        <HeaderTextItalic>FOOD TRUCK SHOWDOWN!</HeaderTextItalic>
      </HeaderSection>
      <CenteredBodyText>
        Comparing the top 20 food trucks,<br></br>based on all-time swipes (Fall 2022 - Fall 2024). 
      </CenteredBodyText>
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
          <SmallerColumnTitle>All-time Swipes (Fall 2022 - Fall 2024)</SmallerColumnTitle>
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
        <LargeHeaderImageLeft src={i3} alt="Header decoration" />
        <HeaderText>The Fate of Food Trucks</HeaderText>
      </HeaderSection>
      <BodyText>
        Over time, UCLA Dining has decreased the presence of food trucks on the Hill. During fall 2023, dinner meal periods had up to six food trucks at a time. By the following winter and spring quarters of the 2023-2024 academic year, this number was halved, with a maximum of three food trucks visiting during a single day's dinner meal period. During fall of 2024, a new peak of four dinner food trucks was reached on six days, though a majority of days only received two.
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          marginTop: '-5px',
          marginBottom: '-10px'
        }}>
          <img 
            src={dinnerDecrease} 
            alt="Daily Number of Food Trucks During Dinner Meal Period" 
            style={{ 
              width: window.innerWidth <= 768 ? '100%' : '80%',
              marginBottom: '20px', 
              marginTop: '20px', 
              display: 'block', 
              marginLeft: 'auto',
              marginRight: 'auto',
              position: 'relative',
              zIndex: 1
            }} 
          />
        </div>

        "I don't know if they're willing to accommodate all these students with dining halls only. Sometimes it gets too busy, and there's no place to sit," Osorio said.<br></br><br></br>

        While at least one food truck was regularly present during the dinner and extended dinner periods throughout the 2023-2024 academic year, lunch offerings started to disappear during the winter. In spring 2024, a food truck was only present May 2 and May 3 during lunch. Although the following quarter had a food truck present on 17 days, this availability was not as frequent nor as consistent as the previous year.<br></br><br></br>

        Despite the decrease in availability of food trucks on the Hill, students spent meal swipes at food trucks at virtually the same rate, with only a 0.2% decline between the two years in total swipes.
        </BodyText>
        <AvailabilityChart/>
        <BodyText>

        While food trucks have become a staple on campus over the past three years, their future remains uncertain due to financial constraints. Brendan Connelly, a second-year mathematics student and president of Hedrick Hall Resident Government Council, cited their relative cost as a key issue for the university.<br></br><br></br>

        "It's a financial burden for them. UCLA Dining, they would like to not have to contract like they did. Because before the pandemic, they didn't have food trucks and they would have more dining hall options open later," Connelly said. "As soon as you take them away, I think students' voices will be loud enough that they will try to get them back."<br></br><br></br>

        As a part of Resident Government Council, Connelly attends policy review board meetings with UCLA Dining directors.<br></br><br></br>

        "They're talking about how it's just so hard to hire people, and that's part of the reason that they still have food trucks, part of the reason that things were slow to open," Connelly said.<br></br><br></br>

        One part of policy review board meetings is UCLA Dining's review of student feedback.<br></br><br></br>

        "Most of the complaints, feedback or compliments are all about Dining ... about specific things that people want to change, and Dining is really receptive to many of the small things," Connelly said.
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#fcbd92' }}>
        <HeaderImageRight src={i1} alt="Header decoration" />
        <HeaderText>Behind the Bite</HeaderText>
      </HeaderSection>
      <BodyText>
        Not just any food truck can serve UCLA students. Michael Gray, the chef of Fat Boys food truck, described the process food trucks go through, which includes a food tasting and truck inspection process before they are approved to serve students.<br></br><br></br>

        "They (UCLA Dining) asked for portion size, give us feedback on what the students are looking for, here's what's been going well so far, here are the food trucks that we have already. They are looking for a variety of foods, so that way, you're not getting the same thing," Gray said. <br></br><br></br>

        Gray said UCLA Dining offers quarter-long contracts to food trucks. In return, food trucks send availability on a week-by-week basis.<br></br><br></br>

        "We submit our availability to them, and they basically pick and fill us in and then let us know what date they need us," Gray said. "We are the ones submitting our availability, so I think yeah, we do have a say. You don't have to say that you're available.

        Gray described the restrictions in creating a campus menu, including a three-item maximum menu. Meanwhile, other trucks have offered four menu items, including 8E8 Thai Street Food and BittieBitez Mini-Donuts. When informed of this, Gray said UCLA Dining told him the limit was three items across all food trucks.<br></br><br></br>

        With each item being exchanged for a meal swipe, food trucks must create a product within a $9 valuation range of a standard portion while staying profitable.<br></br><br></br>

        "That's a very tight budget," Gray said. "As the market lets the prices go up, it's trying to find a product that still allows you to continue that item at a quality that you're OK with serving."<br></br><br></br>

        Gray described how Fat Boys has changed menu items and UCLA's control over its decisions.<br></br><br></br>

        "We have made changes to our menu to allow us to keep up with speed and pricing," Gray said. "The menu is not supposed to change unless it's approved by UCLA. … There's a lot of red tape and a lot of processes that slows everything down, but I guess that's what they've been doing, and that works for them. So you just try to govern yourself within that."<br></br><br></br>

        Formulating a menu is one battle. Then, the queues of students hit.<br></br><br></br>

        "The idea is to get you guys the food within three to five minutes. But, if you have 100 people hitting the truck at one time, that's kind of impossible," Gray said.<br></br><br></br>

        Duncan Parsons, the owner of the <a target="_blank" href='https://prime.dailybruin.com/foodtrucks'>Creamy Boys</a> food truck, commented on accommodating student demand in advance.<br></br><br></br>

        "For all of the food trucks, so much of the prep and the organization and preparations is done before we get to campus because we only have 15 minutes to set up before we serve hundreds and hundreds of students," Parsons said.<br></br><br></br>

        Angel Diaz, truck driver and server at BittieBitez Mini-Donuts food truck, also commented on food preparation. Diaz works alongside his family, as he is the nephew of BittieBitez's owner.<br></br><br></br>

        "We start getting glaze, all the toppings that we're going to serve on the day, ready before the shift and after the shift. We start making the donuts. We do some in advance," Diaz said.<br></br><br></br>

        Even with preparation, food trucks can run into difficulties during their shifts.<br></br><br></br>

        "Sometimes machinery acts weird, and it stops us from doing as many orders," Diaz said. "Sometimes one falls and we don't notice it, and then we gotta do it again. Or sometimes students don't come on time, or we have the orders there, and then the ice cream starts melting, so we have to re-do it – but by that time, we are doing others."<br></br><br></br>

        While several food trucks have shown steady success building a consistent customer base, others have struggled to gain traction, with some dropping out of rotation after only a short period of time.<br></br><br></br>

        Twelve out of the 37 food trucks active during the 2023-2024 academic year were inactive by the start of the 2024-2025 academic year. During fall 2024, no new food trucks were introduced. Notably, Dina's Dumpling became inactive at UCLA by spring 2024, despite ranking second in average swipes per hour during the 2022-2023 school year and fourth in the 2023-2024 school year.<br></br><br></br>
        </BodyText>
        <InactiveChart />
        <BodyText>

        With UCLA Dining's quarterlong contracts with food trucks, a food truck may not necessarily be invited to return the following quarter.<br></br><br></br>

        "If you don't get an invite back from UCLA, you have to go back through the entire process of the food tasting and food inspection," Gray said. "If you don't see a truck, they may have got too many complaints from a student, and it may not have nothing to do with their food. It could be timing."<br></br><br></br>

        When asked about the potential phasing out of food trucks, Parsons felt the decision was up to the university.<br></br><br></br>

        "It's obvious the students love it (food trucks), and you get a great variety of food, and it complements the existing eateries on campus," Parsons said. "I would love to have a say with the university, or for them to ask us what we think, but there's not really any of that. They just kind of let us know what they're planning to do."
      </BodyText>
      <HeaderSection style={{ backgroundColor: '#ecc8f7' }}>
        <HeaderImageLeft src={i6} alt="Header decoration"  />
        <HeaderText>Food for Thought</HeaderText>
      </HeaderSection>
      <BodyText style={{ marginBottom: '50px' }}>
      The fate of food trucks at UCLA is unclear for now. Despite the possible phasing out of food trucks and difficulties serving students, food truck operations remain a key part of the UCLA dining experience.<br></br><br></br>

      "I always tell my crew, I'm like, it's insane how people can wait so much for their donuts, and they enjoy it so much. It makes me happy," Diaz said.
      </BodyText>
      <BodyText></BodyText>
      <FullWidthGreySection>
        <GreySectionImage src={i2} alt="BittieBitez Mini-Donuts" />
        <CreditsContainer style={{ fontStyle: 'italic', marginBottom: '0px', backgroundColor: 'transparent', marginTop: '0px' }}>
          Contributing reports from Sydney Tomsick and Cassidy Sadowski, Stack contributors.
        </CreditsContainer>
        <br></br>
        <GreySectionTitle>About the Data</GreySectionTitle>
        <GreySectionText>
          The data used in this article were provided by UCLA Dining through public records requests as two datasets: one covering the 2022-2023 academic year and a more recent dataset spanning from June 2023 to Jan. 1, 2025. The former covers the 2023-2024 academic year and fall 2024.<br></br><br></br>

          Fourteen food trucks listed were within UCLA's datasets but did not have swipe data: Good Eats and Vibes, Manna From Heaven, Messi Burgers, Mikhuna, ML Eats Burger, Mumu's, Ohana Hibachi, Rice Balls Inc., Something Good LA, Stout Burgers, Taste Collective Burger, Trapiyaki, Veggie Bomb and White Rabbit.
        </GreySectionText>
      </FullWidthGreySection>
    </GridContainer>
  );
};

export default GridPage; 