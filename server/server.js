import express from 'express';  
import fetch from 'node-fetch'; 
import cors from 'cors'; 
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.API_KEY;

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

app.get('/proxy-flights', async (req, res) => {
    const { departureID, arrivalID, outboundDate } = req.query;
    const apiUrl = `https://serpapi.com/search.json?engine=google_flights&currency=USD&hl=en&type=2&travel_class=1&stops=1&departure_id=${departureID}&arrival_id=${arrivalID}&outbound_date=${outboundDate}&api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API response error: ${response}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from API:', error);
        res.status(500).send('Error fetching flight data.');
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
