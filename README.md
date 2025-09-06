# Mobile Walking Lab - Frontend Application

## 📋 Project Overview
Mobile Walking Lab is a comprehensive patient management system designed for healthcare professionals to track and analyze patients' walking/gait patterns. The application provides tools for measuring walking speed, hand pressure, and foot lift patterns through both manual measurements and IoT device integration (ESP32 controller).

## 🚀 Features

### Patient Management
- **Patient Registration & Tracking**: Add, view, and manage patient records
- **Medical History**: Track patient medical conditions and treatment progress
- **Notes System**: Healthcare providers can add timestamped notes for each patient
- **AI-Powered Recommendations**: Integration with GPT for treatment recommendations

### Measurement Capabilities
- **Manual Speed Measurement**: Timer-based speed calculation with distance input
- **ESP32 Device Integration**: Real-time data collection from IoT walking measurement device
- **Multiple Metrics Tracking**:
  - Walking speed (manual and device-based)
  - Hand pressure (left/right)
  - Foot lift count (left/right)
  - Distance measurements

### Data Visualization
- **Interactive Charts**: Toggle between bar and line chart views
- **Historical Data Tracking**: View measurement history over time
- **Video Integration**: View recorded videos of measurement sessions

### Export & Reporting
- **PDF Export**: Generate comprehensive patient reports with charts
- **Chart Images**: Include visual data representations in reports

## 🏗️ Project Structure

```
Mobile-Walking-Lab/
├── .github/
│   └── workflows/        # Azure deployment configuration
├── web_interface/
│   ├── public/
│   │   ├── images/      # UI icons and assets
│   │   └── index.html   # Main HTML template
│   └── src/
│       ├── api/         # API integration modules
│       ├── components/  # React components
│       ├── utils/       # Utility functions
│       ├── app.js       # Main application component
│       ├── index.js     # Application entry point
│       └── index.css    # Global styles
└── package.json         # Project dependencies
```

## 🔧 Technology Stack

- **Frontend Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Chart.js with react-chartjs-2
- **PDF Generation**: @react-pdf/renderer, jsPDF
- **Styling**: Custom CSS with RTL support (Hebrew)
- **Deployment**: Azure Static Web Apps

## 📦 Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd Mobile-Walking-Lab/web_interface

# Install dependencies
npm install

# Start development server
npm start
```

## 🔌 API Configuration

The application connects to a backend API. Configure the base URL in `src/api/apiConfig.js`:

```javascript
export const BASE_URL = "https://walkinglab-hbesf8g3aaa8hafz.westeurope-01.azurewebsites.net/api";
// For local development:
// export const BASE_URL = "http://localhost:5001/api";
```

## 🧩 Key Components

### Authentication & User Management

#### `LoginPage.js`
Handles therapist authentication:
```javascript
loginTherapist(email, password)
  .then((response) => {
    localStorage.setItem('therapist', JSON.stringify(therapistData));
    navigate('/patients');
  })
```

#### `RegisterPage.js`
New therapist registration with validation:
- Email format validation
- Required field checks
- Duplicate email prevention

### Patient Management Components

#### `PatientListPage.js`
- Displays all patients in a sortable table
- Search functionality by name and ID
- Click-to-view patient details
- Sorting by name, ID, or last updated

#### `PatientDetailsPage.js`
Core component for patient management with multiple features:

**Manual Speed Measurement:**
```javascript
const handleStartStopTimer = () => {
  if (manualIsTiming) {
    const durationSeconds = (endTime - manualStartTime) / 1000;
    const speed = distance / durationSeconds;
    const speedKmH = speed * 3.6;
    saveSpeedMeasurement(userId, speedResult);
  }
}
```

**ESP32 Device Control:**
```javascript
const handleStartEspMeasurement = async () => {
  await setESP32Command('start', patient.id);
  // Starts measurement on IoT device
}

const handleStopEspMeasurement = async () => {
  await setESP32Command('stop', patient.id);
  // Retrieves and displays collected data
}
```

### Data Visualization Components

#### `SpeedChart.js`
- Displays speed measurements over time
- Supports both manual and ESP32 data
- Click events for video playback
```javascript
onClick: (evt, elements) => {
  if (elements.length > 0 && onBarClick) {
    const clickedMeasurement = sortedData[index];
    onBarClick(measurementId); // Opens video popup
  }
}
```

#### `PressureChart.js`
- Visualizes left/right hand pressure data
- Toggle between bar and line charts

#### `FootLiftChart.js`
- Shows foot lift counts for gait analysis
- Compares left vs right foot patterns

### Video Integration

#### `VideoPopup.js`
- Modal component for video playback
- Handles missing videos with placeholder
- Supports full-screen video viewing

### Export Functionality

#### `PatientDetailsPDFExport.jsx`
Generates comprehensive PDF reports:
```javascript
const generateChartImages = () => {
  const charts = [
    { ref: refs.manualChartRef, title: 'גרף מהירויות ידניות' },
    { ref: refs.espChartRef, title: 'גרף מהירויות מהבקר' },
    // ... more charts
  ];
  // Convert charts to base64 images for PDF
}
```

## 🔐 API Endpoints

### Patient API (`patientApi.js`)
- `POST /patients` - Add new patient
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get patient details
- `POST /patients/:id/notes` - Add note to patient
- `POST /patients/:id/treatment-recommendation` - Get AI recommendation
- `POST /patients/:id/speed` - Save speed measurement

### Device API (`deviceApi.js`)
- `POST /device/command` - Send command to ESP32
- `GET /device/:userId/measurements` - Get device measurements
- `GET /video/by-measurement/:id` - Get measurement video

### Therapist API (`therapistApi.js`)
- `POST /therapists/register` - Register new therapist
- `POST /therapists/login` - Therapist login

## 📊 Data Flow

1. **Authentication Flow**:
   - Therapist logs in → JWT stored in localStorage → Used for API requests

2. **Measurement Flow**:
   - Manual: Start timer → Enter distance → Calculate speed → Save to database
   - ESP32: Send start command → Device collects data → Send stop command → Retrieve and display data

3. **Data Visualization**:
   - Fetch historical data → Sort by timestamp → Render in charts → Enable interactivity

## 🎨 UI/UX Features

- **RTL Support**: Full Hebrew language support with RTL layout
- **Responsive Design**: Optimized for various screen sizes
- **Interactive Charts**: Toggle between visualization types
- **Real-time Updates**: Live timer displays during measurements
- **User Feedback**: Clear success/error messages
- **Accessibility**: Semantic HTML and ARIA attributes

## 🚢 Deployment

The application is deployed on Azure Static Web Apps:

```yaml
# Azure deployment configuration (.github/workflows/)
- name: Build And Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    app_location: "./web_interface"
    output_location: "build"
```

## 🔧 Environment Variables

Configure these in your deployment environment:
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Azure deployment token
- API base URL configuration in `apiConfig.js`

## 📱 Key Features Implementation

### Measurement Policy Notice
Before starting ESP32 measurements, users see important information:
```javascript
<div className="measurement-policy-box">
  <ul>
    <li>המערכת תבצע מדידת נתוני הליכה</li>
    <li>בעת המדידה תתבצע גם צילום וידאו</li>
    <li>בלחיצה על "התחלת מדידה" הינך מאשר/ת</li>
  </ul>
</div>
```

### Chart Interactivity
Charts support multiple interaction modes:
- Click on bar to view associated video
- Toggle between bar and line views
- Export as image for PDF reports

### Error Handling
Comprehensive error handling for all API calls:
```javascript
.catch((error) => {
  if (error.response.status === 400) {
    alert('⚠️ שגיאה: הנתונים שסיפקת אינם תקינים');
  } else if (error.response.status === 409) {
    alert('⚠️ המטופל כבר קיים במערכת');
  }
  // ... more error cases
})
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC License - see package.json for details

## 👥 Author

**Noa Gilboa** - Initial work and development


---

## 📝 Notes for Developers

- The application uses Hebrew (RTL) as the primary language
- All timestamps are stored in UTC and converted to local time for display
- Chart.js configuration is optimized for RTL languages
- Video files are stored in Azure Blob Storage and accessed via secure URLs
- PDF generation happens client-side for better performance
