const fetch = require('node-fetch');

export default async function handler(req, res) {
    try {
        const { stateCode } = req.query;
        const API_KEY = process.env.API_KEY;
        console.log(API_KEY)
        const response = await fetch(`https://api.ebird.org/v2/data/obs/${stateCode}/recent?key=${API_KEY}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
