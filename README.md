
# Mobile Walking Lab - Patient Management System

**Mobile Walking Lab** is a comprehensive application developed for managing patient records and their rehabilitation progress. The system is designed for therapists to manage patient data, add and track rehabilitation notes, and monitor patient conditions through an easy-to-use interface. The solution includes both backend and frontend components, leveraging modern web technologies for effective data management.

## Project Overview

- **Backend**: Built with **Node.js**, **Express**, and **MongoDB**, the backend provides a secure and scalable API for managing patient and therapist data. It handles registration, authentication, and CRUD operations for patients and their associated notes.
- **Frontend**: Developed with **React**, the frontend provides a dynamic and user-friendly interface for therapists to interact with the system, log in, register, and manage patient information.

## Key Features

### Backend
- **RESTful API** using **Express.js** for managing patients and therapists.
- **MongoDB** as the database, with **Mongoose** for schema definitions and database operations.
- **Authentication** for therapists using secure login mechanisms.
- **CRUD Operations** for patients and notes.

### Frontend
- **React** application for an interactive user experience.
- **Routing** using **React Router DOM** to navigate between different pages.
- **Local Storage** for maintaining therapist session state after logging in.
- **Axios** for making API requests to the backend.

## Technologies Used

### Backend
- **Node.js**: Server-side JavaScript runtime for creating a scalable backend.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing patient and therapist information.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
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

## Project Structure

### Backend
- **Controllers**: Manage the API routes for patients and therapists.
- **Data Access Layer (DAL)**: Handles the interaction with MongoDB for patients and therapists.
- **Services**: Business logic layer, handling operations like patient creation, therapist login, etc.
- **Database Configuration**: Set up MongoDB connection through Mongoose.

### Frontend
- **React Components**: Includes pages like `LandingPage`, `LoginPage`, `PatientListPage`, `PatientDetailsPage`, and more.
- **API Services**: Uses `axios` to communicate with the backend endpoints.
- **Routing**: Implemented with `react-router-dom` for easy navigation.

## Setup

### Prerequisites
- **Node.js** and **npm**: Make sure you have Node.js and npm installed.
- **MongoDB**: Install and run MongoDB locally.

### Running the Project

1. **Backend Setup**:
   - Navigate to the backend directory.
   - Run `npm install` to install dependencies.
   - Start the backend server using `npm start`. The server runs on `http://localhost:5001`.

2. **Frontend Setup**:
   - Navigate to the frontend directory.
   - Run `npm install` to install dependencies.
   - Start the frontend development server using `npm start`. The app runs on `http://localhost:3000`.

## Usage

- **Therapist Logs In**: The therapist can log in using their credentials, and the data is stored in local storage.
- **Manage Patients**: Therapists can add, update, and view patients, as well as add notes to patient records.
- **Data Synchronization**: All patient and note data is synchronized between the backend and the MongoDB database.

## Future Enhancements

- **Patient Monitoring Integration**: Connect the patient dashboard to live monitoring systems for real-time updates.
- **Authentication Enhancements**: Add OAuth or JWT for more secure authentication.
- **Improved UI/UX**: Expand UI features to enhance accessibility and user interaction.

## Video Demonstration

Watch a video demonstration:

https://github.com/user-attachments/assets/960b7cda-1618-4793-9c18-e3287054f67b

