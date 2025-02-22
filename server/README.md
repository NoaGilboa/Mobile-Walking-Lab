# Mobile Walking Lab Backend

This is the backend server for the **Mobile Walking Lab** application, developed using **Node.js**, **Express.js**, and **Azure SQL Database**. It provides RESTful API endpoints for managing patients and therapists within the application and integrates **OpenAI API** for generating treatment recommendations.

## Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Technologies Used](#technologies-used)
- [API Documentation](#api-documentation)
  - [Patient Endpoints](#patient-endpoints)
  - [Therapist Endpoints](#therapist-endpoints)
  - [AI-Generated Treatment Recommendations](#ai-generated-treatment-recommendations)
- [Project Structure](#project-structure)
- [Azure SQL Database Setup](#azure-sql-database-setup)
- [OpenAI Integration](#openai-integration)
- [Usage](#usage)

## Installation

To set up and run this project locally, follow these steps:

1. **Clone the repository**:

    ```sh
    git clone https://github.com/NoaGilboa/Mobile-Walking-Lab.git
    cd server
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Configure environment variables**:
   - Create a `.env` file in the `server/` directory and add the following:
     ```sh
     AZURE_SQL_SERVER=your-azure-sql-server
     AZURE_SQL_DATABASE=your-database-name
     AZURE_SQL_USER=your-username
     AZURE_SQL_PASSWORD=your-password
     OPENAI_API_KEY=your-openai-api-key
     ```

4. **Run the server**:

    ```sh
    npm start
    ```
    The server will start at `http://localhost:5001`.

## Getting Started

This backend provides RESTful APIs for managing therapists and patients in the **Mobile Walking Lab** application, storing data in **Azure SQL Database** and integrating with **OpenAI API** for AI-based treatment recommendations.

### Middleware

- **CORS**: Cross-Origin Resource Sharing is enabled to allow requests from the frontend.
- **Body Parser**: Parses incoming request bodies before reaching handlers.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web framework for creating the API.
- **Azure SQL Database**: Cloud-based relational database to store patient and therapist data.
- **MSSQL (mssql package)**: Microsoft SQL Server client for interacting with Azure SQL.
- **OpenAI API**: Used to generate AI-powered treatment recommendations.
- **CORS & Body-Parser**: Middleware for handling requests and responses.

## API Documentation

### Patient Endpoints

- **`GET /api/patients`** - Retrieves all patients.
- **`POST /api/patients`** - Adds a new patient.
  - Request body:
    ```json
    {
      "userId": "string",
      "name": "string",
      "age": "number",
      "condition": "string"
    }
    ```
- **`GET /api/patients/:userId`** - Retrieves details of a specific patient.
- **`GET /api/patients/:userId/notes`** - Retrieves all notes for a specific patient.
- **`POST /api/patients/:userId/notes`** - Adds a note to a specific patient.

### Therapist Endpoints

- **`POST /api/therapists/register`** - Registers a new therapist.
  - Request body:
    ```json
    {
      "email": "string",
      "password": "string",
      "name": "string"
    }
    ```
- **`POST /api/therapists/login`** - Logs in a therapist.

### AI-Generated Treatment Recommendations

- **`POST /api/patients/:userId/get-treatment-recommendation`** - Generates a treatment recommendation using **OpenAI API**.
  - Request body:
    ```json
    {
      "notes": ["string"]
    }
    ```
  - Response:
    ```json
    {
      "recommendation": "AI-generated treatment plan"
    }
    ```

## Project Structure

```
mobile-walking-lab-backend/
├── config/
│   ├── db.js                   # Azure SQL Database connection
├── controllers/
│   ├── patientController.js    # Handles patient-related API routes
│   ├── therapistController.js  # Handles therapist-related API routes
├── services/
│   ├── patientService.js       # Business logic for patients
│   ├── therapistService.js     # Business logic for therapists
│   ├── openAIService.js        # Handles AI-based treatment recommendations
├── server.js                   # Entry point for the backend
└── README.md                   # Project documentation (you're here!)
```

## Azure SQL Database Setup

The server connects to an **Azure SQL Database** instead of MongoDB. Configure database credentials in `config/db.js`:

```js
const sql = require('mssql');

const config = {
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log("Connected to Azure SQL Database!");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
}

module.exports = { connectDB, sql };
```

## OpenAI Integration

The AI-generated treatment recommendations are powered by OpenAI. The logic is in `services/openAIService.js`:

```js
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function getTreatmentRecommendation(patientData) {
    const prompt = `
        Patient details:
        Age: ${patientData.age}
        Condition: ${patientData.condition}
        Notes: ${patientData.notes.join(', ')}

        Provide a general treatment recommendation.
    `;

    try {
        const response = await openai.createCompletion({
            model: "gpt-4o",
            prompt: prompt,
            max_tokens: 150
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        throw new Error(`Error fetching treatment recommendation: ${error.message}`);
    }
}

module.exports = { getTreatmentRecommendation };
```

## Usage

1. **Start the Backend**:
   ```sh
   npm start
   ```
   The backend will start on `http://localhost:5001`.

2. **API Usage**:
   Use **Postman** or **cURL** to interact with the API.

3. **Connecting to the Frontend**:
   Ensure the frontend is running on `http://localhost:3000` to interact with this backend server.