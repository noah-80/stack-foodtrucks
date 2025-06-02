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

ChartJS.register(Tooltip, Title, Legend, PointElement, LinearScale);

interface TruckDataPoint {
  x: number;
  y: number;
  truck: string;
  rate: number;
}

const Correlation: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'scatter', TruckDataPoint[]> | null>(null);

  useEffect(() => {
    Papa.parse('/foodtruckCorrelationData.csv', {
      download: true,
      header: true,
      complete: (results) => {
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
            pointRadius: 5,
          }]
        });
      }
    });
  }, []);

  const options: ChartOptions<'scatter'> = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Food Trucks: Hours vs. Swipes',
        font: {
          family: 'Barlow',
          size: 18,
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
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hours',
          font: {
            family: 'Hanken Grotesk',
            size: 16,
          },
        },
        ticks: {
          font: {
            family: 'Hanken Grotesk',
            size: 12,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Swipes',
          font: {
            family: 'Hanken Grotesk',
            size: 16,
          },
        },
        ticks: {
          font: {
            family: 'Hanken Grotesk',
            size: 12,
          },
        },
      },
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      {chartData ? <Scatter data={chartData} options={options} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default Correlation;
