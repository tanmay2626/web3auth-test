import axios from "axios";

const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjFlYmVhZTY3MzI0YzM1Y2EzODQ3N2EiLCJpYXQiOjE3MTMyOTA5MzMsImV4cCI6MTcxODQ3NDkzM30.aIpQaLVRL0sd2VL8Gl2cgTG7aD1A45Yz0csAk18rYl0";

const authenticate = async (userData, referralCode) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/login?referralCode=${referralCode}`,
      {
        publicAddress: "0xx",
        email: "tanmay@gmail.com",
        telegramId: 2134334,
        telegramUsername: "twaykar",
        telegramIsPremium: true,
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// response : token, status (new user)

const getProfile = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// response : for profile section

const logout = async (accessToken) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// in profile

// accessToken
const getAllTasks = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/tasks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// for tasks closed view

const getTaskById = async (taskId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// task open view

const verifyTask = async (taskId, accessToken) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/tasks/verify/:userId/:taskId`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// verify task button - success: true/false

const claimReward = async (taskId) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/tasks/claim/${taskId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// coins and message

const connectTwitter = async (twitterDetails, accessToken) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/connect/twitter`,
      {
        twitterId: 328739,
        titterUsername: "twaykar8",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// verify task button - success: true/false

const getLeaderboard = async (level) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/leaderboard?level=${level}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// array with { accountID, username, coins }

const getUserStats = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/userStats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// For landing page : coins, rank. directRefferal, IndirectRefferals, totalUsers,currentLeague,

const getAccountRaffleInfo = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/raffleInfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

// Dino and Tasks section - coins, rank, doneTasks[ ], highestCard, drawnCards[ ]
// And tasks section to filter

const getGameStats = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API}/gameStats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

const updateGameStats = async (gameData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/updategamestats`,
      gameData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

const claimBooster = async () => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/claimbooster`,
      {
        price: 750,
        boosterType: "turbo",
        increment: 2,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    throw error;
  }
};

export {
  authenticate,
  getProfile,
  logout,
  getAllTasks,
  getTaskById,
  verifyTask,
  claimReward,
  connectTwitter,
  getLeaderboard,
  getUserStats,
  getAccountRaffleInfo,
  getGameStats,
  updateGameStats,
  claimBooster,
};

// 11 routes - non game
