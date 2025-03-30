# Transaction Dashboard

A modern, responsive dashboard application for managing and visualizing transaction data. Built with React, TypeScript, and Ant Design.

## Features

- 📊 Real-time transaction monitoring
- 📈 Interactive charts and visualizations
- 🔍 Advanced filtering and search capabilities
- 📱 Responsive design for all devices
- 🔒 Secure authentication system
- 📋 Detailed transaction history
- 🎨 Modern and clean UI design

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **UI Library**: Ant Design
- **Charts**: Ant Design Charts
- **State Management**: React Query
- **Routing**: React Router
- **Styling**: SCSS
- **Date Handling**: Day.js

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/transaction-dashboard.git
```

2. Navigate to the project directory:

```bash
cd transaction-dashboard
```

3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Project Structure

````
src/
├── api/                    # API integration
├── components/            # React components
│   ├── auth/             # Authentication components
│   └── dashboard/        # Dashboard components
│       └── components/   # Dashboard sub-components
├── config/               # Configuration files
├── hooks/                # Custom React hooks
├── routes/              # Route definitions
└── utils/               # Utility functions


## Features in Detail

### Dashboard

- Transaction statistics
- Interactive charts
- Filterable transaction table
- Real-time data updates

### Authentication

- Secure login system
- Session management
- Protected routes

### Data Visualization

- Currency distribution chart
- Transaction status timeline

## API Integration

The application integrates with a RESTful API for:

- User authentication
- Transaction data
- Real-time updates


## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_SECRET_KEY=YourSecretkey
VITE_BASE_URL= apicallbaseurl
````

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Acknowledgments

- Ant Design for the UI components
- React Query for data fetching and caching
- Day.js for date manipulation
