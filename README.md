# Bird Sightings Visualization

This project is built with [React](https://reactjs.org/) and [D3.js](https://d3js.org/), utilizing data from [eBird](https://ebird.org/home). The visualization aims to display recent bird sightings in the United States, organized by state. The data source for this project is eBird, a project of the Cornell Lab of Ornithology and National Audubon Society. 

## Setup Instructions

To set up and run this project locally, follow these steps:

1. **Get an API Key from eBird**:
   - You need to obtain an API key from eBird to access their data. You can request an API key by following the instructions [here](https://documenter.getpostman.com/view/664302/S1ENwy59).

2. **Add API Key to `.env` File**:
   - After obtaining your API key, add it to the `.env` file in the root directory of the project.

3. **Install Dependencies**:
   - Open your terminal and navigate to the root directory of the project.
   - Run the following command to install the necessary dependencies:
     ```
     npm install
     ```

4. **Start the Server**:
   - While in the root directory of the project, run the following command to start the server:
     ```
     npm start
     ```

5. **Start the Frontend**:
   - Open a new terminal window.
   - Navigate to the `bird-watching-ui` directory within the project.
   - Run the following command to start the frontend:
     ```
     npm run start
     ```

Once you've completed these steps, you should be able to access the visualization by navigating to `http://localhost:3000` in your web browser.


