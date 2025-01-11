# Crypto Stats and Deviation API

This project provides a backend service for fetching cryptocurrency statistics (price, market cap, 24-hour change, etc.) and calculating the price deviation based on historical data stored in a MongoDB database. The backend is built using Node.js, Express, and MongoDB.

## Features

- **Stats API**: Fetches cryptocurrency statistics (price, market cap, and 24-hour change) from the CoinGecko API and stores the data in MongoDB.
- **Deviation API**: Calculates the price deviation of a given cryptocurrency based on stored historical data.

## Prerequisites

- Node.js (>=16.x)
- MongoDB (Atlas or local instance)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder and add the following:
   ```env
   MONGO_URI=<your-mongodb-uri>
   PORT=5000 # Optional, defaults to 5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5000`.

## API Endpoints

### Stats API

**Endpoint**: `GET /api/stats?coin=<coin-name>`

Fetches cryptocurrency statistics and stores the data in MongoDB.

- **Parameters**:
  - `coin` (required): The ID of the cryptocurrency (e.g., `bitcoin`, `ethereum`).

- **Response**:
  ```json
  {
    "price": 94226,
    "marketCap": 123456789,
    "24hChange": -2.34,
    "timestamp": "2025-01-11T09:40:40.477Z"
  }
  ```

- **Error Responses**:
  - `400`: Invalid coin
  - `429`: Rate limit exceeded
  - `500`: Server error

### Deviation API

**Endpoint**: `GET /api/deviation?coin=<coin-name>`

Calculates the price deviation of a cryptocurrency based on historical data stored in MongoDB.

- **Parameters**:
  - `coin` (required): The ID of the cryptocurrency (e.g., `bitcoin`, `ethereum`).

- **Response**:
  ```json
  {
    "deviation": 123.45
  }
  ```

- **Error Responses**:
  - `400`: No valid price data available for the given coin
  - `500`: Server error

## Folder Structure

```
backend/
├── models/
│   └── Crypto.js           # Mongoose schema for cryptocurrency data
├── routes/
│   ├── stats.js            # Route for fetching cryptocurrency stats
│   └── deviation.js        # Route for calculating price deviation
├── services/
│   └── cryptoService.js    # Utility functions for data processing
├── .env                    # Environment variables (not included in the repo)
├── server.js               # Main entry point of the backend
├── package.json            # Project dependencies and scripts
└── Procfile                # Configuration for deployment (e.g., Heroku)
```

## Deployment

1. Ensure that all environment variables (e.g., `MONGO_URI`) are properly configured.
2. Deploy the backend to a cloud platform (e.g., Heroku, AWS, or Azure).

For Heroku:
- Add the MongoDB URI as a config variable.
- Push the code to your Heroku application.

## Notes

- The backend expects MongoDB to be running and accessible via the `MONGO_URI`.
- API requests to CoinGecko are rate-limited. Avoid making excessive requests in a short period.

## License

This project is licensed under the MIT License. Feel free to use and modify as needed.

