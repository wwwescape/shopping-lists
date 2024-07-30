// src/components/CreateUser.js
import React, { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
    marginTop: theme.spacing(2),
  },
}));

const CreateUser = ({ onCreateUser }) => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleCreateUser = async () => {
    // Perform validation (e.g., password match)
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`${localStorage.getItem('serverURL')}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          firstname: firstName,
          lastname: lastName,
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        localStorage.setItem('adminUser', JSON.stringify(newUser));
        onCreateUser(newUser);
      } else {
        alert('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Create Admin User
      </Typography>
      <TextField
        className={classes.inputField}
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        className={classes.inputField}
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        className={classes.inputField}
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <TextField
        className={classes.inputField}
        label="First Name"
        variant="outlined"
        fullWidth
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        className={classes.inputField}
        label="Last Name"
        variant="outlined"
        fullWidth
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleCreateUser}
      >
        Create
      </Button>
    </div>
  );
};

export default CreateUser;
