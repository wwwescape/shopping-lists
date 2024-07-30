// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from '@emotion/styled';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import SetupServer from "./components/SetupServer";
import CreateUser from "./components/CreateUser";
import Login from "./components/Login";
import Lists from "./components/Lists";
import List from "./components/List";
import Users from "./components/Users";
import Settings from "./components/Settings";

const useStyles = styled((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
}));

const App = () => {
  const classes = useStyles();
  const [serverURLSet, setServerURLSet] = useState(false);
  const [adminUserSet, setAdminUserSet] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if serverURL is already set
    const serverURL = localStorage.getItem("serverURL");
    if (serverURL) {
      setServerURLSet(true);
    }

    // Check if adminUser is already set
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      setAdminUserSet(true);
    }
  }, []);

  const handleConnect = () => {
    setServerURLSet(true);
  };

  const handleCreateAdminUser = (user) => {
    setAdminUserSet(true);
  };

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Container component="main" className={classes.main} maxWidth="lg">
          <Routes>
            <Route
              path="/"
              exact
              element={
                <>
                  {!serverURLSet && <SetupServer onConnect={handleConnect} />}
                  {serverURLSet && !adminUserSet && (
                    <CreateUser onCreateUser={handleCreateAdminUser} />
                  )}
                  {serverURLSet && adminUserSet && !isLoggedIn && (
                    <Login />
                  )}
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/list/:listId" element={<List />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
};

export default App;
