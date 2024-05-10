const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/api/birds/:stateCode', (req, res) => {
    const stateCode = req.params.stateCode;
    const API_KEY = "test"

    const curlCommand = `curl --location 'https://api.ebird.org/v2/data/obs/${stateCode}/recent' \
    --header 'X-eBirdApiToken: ${API_KEY}'`

    exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing cURL command:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (stderr) {
            console.error('cURL command returned an error:', stderr);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const responseData = JSON.parse(stdout);
        res.json(responseData);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
