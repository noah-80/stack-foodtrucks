import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  Tooltip,
  Title,
  Legend,
  PointElement,
  LinearScale,
  ChartOptions,
  ChartData
} from 'chart.js';
import foodtruckCorrelationData from './foodtruckCorrelationData.csv?url';

ChartJS.register(Tooltip, Title, Legend, PointElement, LinearScale);

interface TruckDataPoint {
  x: number;
  y: number;
  truck: string;
  rate: number;
}

const backgroundColorPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart: any) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 192, 225, 0.25)'; // Light blue background
    ctx.fillRect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
    ctx.restore();
  }
};

const Correlation: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'scatter', TruckDataPoint[]> | null>(null);
  const [pointRadius, setPointRadius] = useState(5);

  useEffect(() => {
    // Update point radius based on screen width
    const updatePointRadius = () => {
      const width = window.innerWidth;
      if (width <= 480) { // Mobile
        setPointRadius(3);
      } else if (width <= 768) { // Tablet
        setPointRadius(4);
      } else { // Desktop
        setPointRadius(5);
      }
    };

    // Initial update
    updatePointRadius();

    // Add resize listener
    window.addEventListener('resize', updatePointRadius);

    // Cleanup
    return () => window.removeEventListener('resize', updatePointRadius);
  }, []);

  useEffect(() => {
    Papa.parse(foodtruckCorrelationData, {
      download: true,
      header: true,
      complete: (results: { data: Record<string, string>[]; }) => {
        const rawData = results.data as Record<string, string>[];

        const parsedData: TruckDataPoint[] = rawData.map(row => ({
          x: parseFloat(row.hours),
          y: parseFloat(row.swipes),
          truck: row.truck,
          rate: parseFloat(row['swipes/hour']),
        })).filter(point =>
          !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.rate)
        );

        setChartData({
          datasets: [{
            data: parsedData,
            backgroundColor: 'rgba(103, 81, 150, 1)',
            pointRadius: pointRadius,
          }]
        });
      }
    });
  }, [pointRadius]); // Add pointRadius as a dependency

  const options: ChartOptions<'scatter'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Food Trucks: Hours vs. Swipes',
        font: {
          family: 'Barlow',
          size: window.innerWidth <= 768 ? 16 : 18,
          weight: 'bold',
        },
        color: '#231F20',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const point = context.raw as TruckDataPoint;
            return `${point.truck}: ${point.rate.toFixed(2)} swipes/hour`;
          }
        }
      },
    }, 
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hours',
          font: {
            family: 'Hanken Grotesk',
            size: window.innerWidth <= 768 ? 14 : 16,
          },
        },
        ticks: {
          font: {
            family: 'Hanken Grotesk',
            size: window.innerWidth <= 768 ? 10 : 12,
          },
        },
        border: {
          dash: [5, 5],
        },
      },
      y: {
        max: 180000,
        title: {
          display: true,
          text: 'Swipes',
          font: {
            family: 'Hanken Grotesk',
            size: window.innerWidth <= 768 ? 14 : 16,
          },
        },
        ticks: {
          font: {
            family: 'Hanken Grotesk',
            size: window.innerWidth <= 768 ? 10 : 12,
          },
        },
        border: {
          dash: [5, 5],
        },
      },
    },
  };

  return (
    <div style={{ 
      position: 'relative', 
      width: 'min(800px, 90vw)', 
      height: 'min(600px, 70vh)',
      margin: '0 auto',
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {chartData ? (
        <Scatter 
          data={chartData} 
          options={options} 
          plugins={[backgroundColorPlugin]} 
        />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default Correlation;
