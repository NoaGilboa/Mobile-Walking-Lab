// SpeedChart.js
import { Bar, Line } from 'react-chartjs-2';
import ToggleSwitch from './ToggleSwitch';

const SpeedChart = ({ chartType, onToggle, chartRef, data, title ,type}) => {
    if (!data || data.length === 0) return null;

    const labels = data.slice().sort((a, b) => new Date(a.measured_at) - new Date(b.measured_at)).map((item, idx) => {
        const date = new Date(item.measured_at);
        const timeStr = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('he-IL');
        return `מדידה ${idx + 1}\n${dateStr}\n${timeStr}`;
    });

    const dataset = {
        labels,
        datasets: [
            {
                label: 'מהירות (מטר לשנייה)',
                data: data.map(item => item.value || item.speed_kmh || item.speed),
                backgroundColor: type === 'manual' ? 'rgba(75, 83, 192, 0.6)': 'rgba(75, 192, 126, 0.6)',
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'מהירות (מטר לשנייה)'
                }
            },
            x: {
                ticks: {
                    callback: function (val, index) {
                        const label = this.getLabelForValue(index);
                        return label.split('\n');
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `מהירות: ${context.formattedValue} מטרים לשנייה`;
                    }
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <div className="header-chart-type-container">
                <h4 className="chart-type-title">היסטוריית מהירויות {title && `- ${title}`}</h4>
                <ToggleSwitch isLine={chartType === 'line'} onToggle={onToggle} />
            </div>
            {chartType === 'bar' ? (
                <Bar ref={chartRef} data={dataset} options={options} />
            ) : (
                <Line ref={chartRef} data={dataset} options={options} />
            )}
        </div>
    );
};

export default SpeedChart;

