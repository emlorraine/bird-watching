const getBirds = async (stateCode) => {
    const serverUrl = 'http://localhost:3001';
    try {
        const response = await fetch(`${serverUrl}/api/birds/${stateCode}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

export default getBirds;