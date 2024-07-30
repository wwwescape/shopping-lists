// src/components/SetupServer.js
import React, { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CreateUser from './CreateUser';
import Login from './Login';

const useStyles = styled((theme) => ({
  root: {
    maxWidth: 400,
    margin: 'auto',
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  inputField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const SetupServer = ({ onConnect }) => {
  const classes = useStyles();
  const [serverURL, setServerURL] = useState('');
  const [testResult, setTestResult] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);

  const handleTestServer = async () => {
    try {
      const response = await fetch(`${serverURL}/api/test`);
      if (response.ok) {
        setTestResult('Connection successful!');
      } else {
        setTestResult('Connection failed.');
      }
    } catch (error) {
      setTestResult('Connection failed.');
    }
  };

  const handleConnect = () => {
    // Save serverURL to localStorage
    localStorage.setItem('serverURL', serverURL);

    // Check if adminUser is already set
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      setShowCreateUser(true); // Show CreateUser component
    } else {
      onConnect(); // Proceed to main app screens
    }
  };

  // Check if serverURL is already set
  const storedServerURL = localStorage.getItem('serverURL');
  if (storedServerURL) {
    return <Login />;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Setup Server URL
      </Typography>
      <TextField
        className={classes.inputField}
        label="Enter Server URL"
        variant="outlined"
        fullWidth
        value={serverURL}
        onChange={(e) => setServerURL(e.target.value)}
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleTestServer}
      >
        Test
      </Button>
      <Typography variant="body1" gutterBottom>
        {testResult}
      </Typography>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleConnect}
      >
        Connect
      </Button>

      {/* Show CreateUser component if not already set */}
      {showCreateUser && <CreateUser onCreateUser={() => setShowCreateUser(false)} />}
    </div>
  );
};

export default SetupServer;
