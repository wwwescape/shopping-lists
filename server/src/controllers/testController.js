// server/src/controllers/testController.js

const testEndpoint = (req, res) => {
    try {
      // Your logic here
      res.status(200).json({ message: 'API Test Successful!' });
    } catch (err) {
      console.error('Error in test endpoint:', err);
      res.status(500).json({ error: 'Server Error' });
    }
  };
  
  module.exports = { testEndpoint };
  