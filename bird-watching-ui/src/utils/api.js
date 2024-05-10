const getBirds = (stateCode) => {
    const serverUrl = 'http://localhost:3001';
    fetch(`${serverUrl}/api/birds/${stateCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok', response);
            }
            return response.json();
        })
        .then(data => console.log("Result:", data))
        .catch(error => console.error('Error fetching data:', error));
};

export default getBirds;
