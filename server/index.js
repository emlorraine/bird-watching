const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;
const API_KEY = "1gdhhlb11t6s";

app.get('/api/birds/:stateCode', async (req, res) => {
    const stateCode = req.params.stateCode;
    try {
        const response = await fetch(`https://api.ebird.org/v2/data/obs/${stateCode}/recent`, {
            headers: new Headers({
                'X-eBirdApiToken': API_KEY
            })
        });
        if (!response.ok) {
            throw new Error('Request failed');
        }
        const responseData = await response.json();
        res.json(responseData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
