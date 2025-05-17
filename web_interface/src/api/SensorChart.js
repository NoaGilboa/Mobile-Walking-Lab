// SensorChart.js
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const SensorChart = ({ sensorData }) => {
  const data = {
    labels: sensorData.map((_, idx) => `T+${idx * 2}s`),
    datasets: [
      {
        label: 'Weight (g)',
        data: sensorData.map(d => d.weight),
        borderColor: 'blue',
        tension: 0.4,
      },
      {
        label: 'Distance (mm)',
        data: sensorData.map(d => d.distance),
        borderColor: 'green',
        tension: 0.4,
      }
    ]
  };

  return <Line data={data} />;
};

export default SensorChart;

  
