// ToggleSwitch.js
import './ToggleSwitch.css';

const ToggleSwitch = ({ isLine, onToggle }) => {
  return (
    <div className="chart-switch-wrapper">
      <div
        className={`chart-toggle-option ${!isLine ? 'selected' : ''}`}
        onClick={() => isLine && onToggle()}
      >
        עמודות 📊
      </div>
      <div
        className={`chart-toggle-option ${isLine ? 'selected' : ''}`}
        onClick={() => !isLine && onToggle()}
      >
        עקומה 📈
      </div>
    </div>
  );
};



export default ToggleSwitch;
