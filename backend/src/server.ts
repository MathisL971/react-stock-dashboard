import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_KEY = process.env.FINNHUB_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

async function getQuoteDirectly(symbol: string): Promise<object | null> {
  if (!API_KEY) {
    console.error('FINHUB_API_KEY environment variable not set.');
    return null;
  }

  const url = `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;

  try {
    const response = await axios.get(url);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching quote:', error.message);
    if (error.response && error.response.data) {
      console.error('API Response:', error.response.data);
    }
    return null;
  }
}

// Example usage:
getQuoteDirectly("AAPL")
  .then(data => {
    if (data) {
      console.log(data);
    }
  });