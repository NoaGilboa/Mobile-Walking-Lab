
# Mobile Walking Lab - Patient Dashboard Frontend

This repository contains the frontend code for the **Mobile Walking Lab** application. The frontend provides a user interface for therapists to manage patients and their notes.

## Table of Contents

- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Features](#features)

## Getting Started

To run this project locally:

1. **Clone the repository**:

    ```sh
    git clone https://github.com/NoaGilboa/Mobile-Walking-Lab.git
    cd web_interface
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

3. **Start the development server**:

    ```sh
    npm start
    ```

    The frontend server will start at `http://localhost:3000`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner.

### `npm run eject`

Removes the single build dependency from the project.

## Dependencies

The project uses the following main dependencies:

- **React** (`^18.0.0`): A JavaScript library for building user interfaces.
- **React DOM** (`^18.0.0`): React package for working with the DOM.
- **React Router DOM** (`^6.0.0`): A collection of navigational components for React applications.
- **Axios** (`^1.0.0`): A promise-based HTTP client for making requests to the server.

For full details of the dependencies, refer to the `package.json` file.

## Project Structure

The project's file structure is organized as follows:

```
web_interface/
├── public/
│   └── index.html              # Entry point for the web application
├── src/
│   ├── components/             # React components used in the app
│   │   ├── LandingPage.js      # Landing page component
│   │   ├── LoginPage.js        # Login page for therapists
│   │   ├── RegisterPage.js     # Therapist registration page
│   │   ├── PatientListPage.js  # Page displaying list of patients
│   │   ├── PatientDetailsPage.js # Details for each patient, including notes
│   │   └── AddPatientPage.js   # Form for adding a new patient
│   ├── api/                    # API services
│   │   ├── patientApi.js       # API functions for patient management
│   │   └── therapistApi.js     # API functions for therapist management
│   ├── App.js                  # Main app component that manages routing
│   ├── index.js                # Entry point for React rendering
│   ├── apiConfig.js            # Configuration for API base URL
│   └── index.css               # Main CSS file for styling
└── package.json                # Project metadata and dependencies
```

### Key Files

- **`index.html`**: The HTML entry point for the React app.
- **`App.js`**: Main component handling application routes.
- **`index.js`**: Renders the `App` component inside the root element of the HTML.
- **`patientApi.js`** & **`therapistApi.js`**: API functions to interact with the backend for patients and therapists.

## Usage

### Running the Application

1. **Backend**: Make sure the backend server is running on `http://localhost:5001`.
2. **Frontend**: Run `npm start` to start the frontend development server.

The frontend provides an interface for therapists to:

- Login using their credentials.
- Add, view, and manage patients and their notes.

## Features

- **Therapist Login and Registration**:
  - Therapists can log in and register.
  - Therapist session data is saved in local storage after login.

- **Patient Management**:
  - Add new patients with `userId`, name, age, and condition.
  - View a list of all patients.
  - Click on a patient to view detailed information, including existing notes.
  - Add new notes to a patient’s record.

- **React Router**:
  - The application uses `react-router-dom` for managing routes between components, providing a seamless experience.

- **Styling**:
  - The application includes custom styling for a clean and user-friendly interface, utilizing **CSS** for consistency across all pages.

## Styling

The application uses `index.css` for global styles. Key elements such as buttons, input fields, and the layout are styled for a professional and easy-to-navigate UI.

