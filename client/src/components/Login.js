// src/components/Login.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Link, Container } from '@mui/material';
import styled from '@emotion/styled';

const useStyles = styled((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    margin: theme.spacing(1, 0),
  }
}));

const Login = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate('/lists'); // Redirect to lists page if already logged in
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const serverURL = localStorage.getItem('serverURL');
      const response = await fetch(`${serverURL}/api/users/login`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log(data); // Optionally handle response
      localStorage.setItem('isLoggedIn', true); // Set login state
      navigate('/lists'); // Redirect to lists page
    } catch (error) {
      console.error('Error during login:', error);
      // Handle login error (display message, reset fields, etc.)
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic, e.g., navigate to forgot password page
    navigate('/forgot-password');
  };

  const handleSwitchServer = () => {
    // Handle switch server logic, e.g., navigate to setup server page
    navigate('/setup');
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.root}>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <p>Current server URL: {localStorage.getItem('serverURL')}</p>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Link href="#" variant="body2" className={classes.link} onClick={handleForgotPassword}>
            Forgot password?
          </Link>
          <Link href="#" variant="body2" className={classes.link} onClick={handleSwitchServer}>
            Switch to another server
          </Link>
        </form>
      </div>
    </Container>
  );
};

export default Login;
