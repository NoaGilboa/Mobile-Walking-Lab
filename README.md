# Mobile Walking Lab - Patient Management System

**Mobile Walking Lab** is a comprehensive application developed for managing patient records and their rehabilitation progress. The system is designed for therapists to manage patient data, add and track rehabilitation notes, and monitor patient conditions through an easy-to-use interface. The solution includes both backend and frontend components, leveraging modern web technologies for effective data management.

## Project Overview

- **Backend**: Built with **Node.js**, **Express**, and **Azure SQL Database**, the backend provides a secure and scalable API for managing patient and therapist data. It handles registration, authentication, and CRUD operations for patients and their associated notes.
- **Frontend**: Developed with **React**, the frontend provides a dynamic and user-friendly interface for therapists to interact with the system, log in, register, and manage patient information.
- **AI Integration**: Uses **OpenAI API** to generate treatment recommendations based on patient history and notes.

## Key Features

### Backend
- **RESTful API** using **Express.js** for managing patients and therapists.
- **Azure SQL Database** as the backend database for structured and scalable data storage.
- **Authentication** for therapists using secure login mechanisms.
- **CRUD Operations** for patients and notes.
- **OpenAI API Integration** to generate AI-powered treatment recommendations.

### Frontend
- **React** application for an interactive user experience.
- **Routing** using **React Router DOM** to navigate between different pages.
- **Local Storage** for maintaining therapist session state after logging in.
- **Axios** for making API requests to the backend.

## Technologies Used

### Backend
- **Node.js**: Server-side JavaScript runtime for creating a scalable backend.
- **Express.js**: Framework for building RESTful APIs.
- **Azure SQL Database**: Cloud-based relational database for storing patient and therapist information.
- **MSSQL (Azure SQL)**: Database connection and query management.
- **OpenAI API**: AI-based treatment recommendation system.
- **CORS** and **body-parser**: Middleware for handling cross-origin requests and parsing request bodies.

### Frontend
- **React**: JavaScript library for building interactive user interfaces.
- **React Router DOM**: For navigation between pages.
- **Axios**: For HTTP requests to the backend.
- **CSS**: Styling for a clean and consistent look.

## Functional Overview

- **Therapist Authentication**:
  - Register a new therapist.
  - Log in using email and password.
  - Store therapist session data using **localStorage**.

- **Patient Management**:
  - **Add a Patient**: Add new patient data, including user ID, name, age, and condition.
  - **View Patients**: See a list of all patients managed by the therapist.
  - **View Patient Details**: See detailed information about a patient, including their condition and notes.
  - **Add Notes**: Add rehabilitation notes for a patient, which will be stored and displayed.
  - **AI Treatment Recommendations**: Get AI-generated recommendations based on patient history.

## Project Structure

### Backend
- **Controllers**: Manage the API routes for patients and therapists.
- **Database Configuration**: Azure SQL Database connection setup.
- **Services**: Business logic layer, handling operations like patient creation, therapist login, etc.
- **OpenAI Integration**: AI-based recommendation system using OpenAI API.

### Frontend
- **React Components**: Includes pages like `LandingPage`, `LoginPage`, `PatientListPage`, `PatientDetailsPage`, and more.
- **API Services**: Uses `axios` to communicate with the backend endpoints.
- **Routing**: Implemented with `react-router-dom` for easy navigation.

## Setup

### Prerequisites
- **Node.js** and **npm**: Make sure you have Node.js and npm installed.
- **Azure SQL Database**: Set up a database instance on **Azure**.
- **OpenAI API Key**: Obtain an API key from **OpenAI**.

### Running the Project

1. **Backend Setup**:
   - Navigate to the backend directory.
   - Create a `.env` file and add the following:
     ```
     AZURE_SQL_SERVER=your_server_name.database.windows.net
     AZURE_SQL_DATABASE=your_database_name
     AZURE_SQL_USER=your_username
     AZURE_SQL_PASSWORD=your_password
     OPENAI_API_KEY=your_openai_api_key
     ```
   - Run `npm install` to install dependencies.
   - Start the backend server using `npm start`. The server runs on `http://localhost:5001`.

2. **Frontend Setup**:
   - Navigate to the frontend directory.
   - Run `npm install` to install dependencies.
   - Start the frontend development server using `npm start`. The app runs on `http://localhost:3000`.

## Usage

- **Therapist Logs In**: The therapist can log in using their credentials, and the data is stored in local storage.
- **Manage Patients**: Therapists can add, update, and view patients, as well as add notes to patient records.
- **Get AI-Based Treatment Recommendations**: The system provides **AI-generated** treatment suggestions based on patient data using **OpenAI API**.

## Future Enhancements

- **Live Patient Monitoring**: Integration with wearable devices for real-time health tracking.
- **Improved Authentication**: Implementing OAuth or JWT for enhanced security.
- **Enhanced AI Features**: Expanding AI capabilities for more personalized recommendations.

## Video Demonstration

Watch a video demonstration:

https://github.com/user-attachments/assets/960b7cda-1618-4793-9c18-e3287054f67b
