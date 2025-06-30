// PressureChart.js
import { Bar, Line } from 'react-chartjs-2';
import ToggleSwitch from './ToggleSwitch';

const PressureChart = ({ chartType, onToggle, chartRef, leftData, rightData }) => {
    const minLength = Math.min(leftData.length, rightData.length);
    const sortedLeft = [...leftData].sort((a, b) => new Date(a.measured_at) - new Date(b.measured_at)).slice(0, minLength);
    const sortedRight = [...rightData].sort((a, b) => new Date(a.measured_at) - new Date(b.measured_at)).slice(0, minLength);

    const labels = sortedLeft.map((item, idx) => {
        const date = new Date(item.measured_at);
        const timeStr = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('he-IL');
        return `מדידה ${idx + 1}\n${dateStr}\n${timeStr}`;
    });

    const dataset = {
        labels,
        datasets: [
            {
                label: 'לחץ יד שמאל',
                data: sortedLeft.map(item => item.value),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'לחץ יד ימין',
                data: sortedRight.map(item => item.value),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                fill: false
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
                    text: 'לחץ (ק״ג)'
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
                        return `${context.dataset.label}: ${context.formattedValue} ק״ג`;
                    }
                }
            }
        }
    };

    return (
        <div className="chart-container">
            <div className="header-chart-type-container">
                <h4 className="chart-type-title">היסטוריית לחץ ידיים מהבקר</h4>
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

export default PressureChart;
