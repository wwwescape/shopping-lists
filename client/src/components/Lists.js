// shopping-lists-client/src/components/Lists.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Typography,
  Container,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Lists = () => {
  const [open, setOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [allCollaborators, setAllCollaborators] = useState([]); // To store all users fetched from the server
  const [lists, setLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login page if not logged in
    } else {
      fetchLists(); // Fetch lists if user is logged in
      fetchAllCollaborators(); // Fetch all users for the collaborators field
    }
  }, [navigate]);

  const fetchLists = async () => {
    try {
      const serverURL = localStorage.getItem("serverURL");
      const response = await fetch(`${serverURL}/api/lists`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lists");
      }

      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const fetchAllCollaborators = async () => {
    try {
      const serverURL = localStorage.getItem("serverURL");
      const response = await fetch(`${serverURL}/api/lists/collaborators`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setAllCollaborators(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (listName.trim() !== "") {
      try {
        const serverURL = localStorage.getItem("serverURL");
        const response = await fetch(`${serverURL}/api/lists`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: listName, collaborators, createdBy: 1 }),
        });

        if (response.ok) {
          const newList = await response.json();
          setLists([...lists, newList]); // Add the new list to the existing lists
          setOpen(false);
          setListName(""); // Reset the input field
          setCollaborators([]); // Reset collaborators field
        } else {
          console.error("Failed to create list:", response);
        }
      } catch (error) {
        console.error("Error creating list:", error);
      }
    }
  };

  const handleListClick = (listId) => {
    navigate(`/list/${listId}`);
  };

  return (
    <Container component="main" maxWidth="md">
      <Typography component="h1" variant="h4" gutterBottom>
        Lists
      </Typography>
      <List>
        {lists.map((list) => (
          <ListItemButton
            key={list.id}
            onClick={() => handleListClick(list.id)}
          >
            <ListItemText primary={list.name} />
          </ListItemButton>
        ))}
      </List>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      {/* Dialog for entering list name */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New List</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the new list you want to create.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            fullWidth
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Collaborators</InputLabel>
            <Select
              multiple
              value={collaborators}
              onChange={(e) => setCollaborators(e.target.value)}
              renderValue={(selected) =>
                selected
                  .map((id) => {
                    const user = allCollaborators.find((user) => user.id === id);
                    return user ? user.username : "";
                  })
                  .join(", ")
              }
            >
              {allCollaborators.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Lists;
