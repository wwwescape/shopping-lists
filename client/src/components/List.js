import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import {
  Typography,
  Container,
  TextField,
  Button,
  List as MuiList,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CreatableSelect from "react-select/creatable"; // Import CreatableSelect

const ListPage = () => {
  const { listId } = useParams();
  const [list, setList] = useState(null);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [itemNotes, setItemNotes] = useState("");
  const [itemOptions, setItemOptions] = useState([]);
  const [newItem, setNewItem] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [newCategory, setNewCategory] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State to control item select value
  const [selectedCategory, setSelectedCategory] = useState(null); // State to control category select value
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login page if not logged in
    }

    const serverURL = localStorage.getItem("serverURL");
    const socket = io(serverURL); // Connect to Socket.IO server

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("listUpdated", (updatedListId) => {
      console.log("Socket listUpdated", updatedListId);
      // Handle real-time update for specific list
      if (updatedListId === listId) {
        fetchList();
      }
    });

    const fetchList = async () => {
      try {
        const response = await fetch(`${serverURL}/api/lists/list/${listId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch list");
        }
        const data = await response.json();
        setList(data);
      } catch (error) {
        console.error("Error fetching list:", error);
        // Handle error
      }
    };

    const fetchItems = async () => {
      try {
        const response = await fetch(`${serverURL}/api/items`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const items = await response.json();
        // Format items for react-select options
        const options = items.map((item) => ({
          value: item.id,
          label: item.item_name,
        }));
        setItemOptions(options);
      } catch (error) {
        console.error("Error fetching items:", error);
        // Handle error
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${serverURL}/api/categories`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categories = await response.json();
        // Format items for react-select options
        const options = categories.map((category) => ({
          value: category.id,
          label: category.category_name,
        }));
        setCategoryOptions(options);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Handle error
      }
    };

    fetchList();
    fetchItems();
    fetchCategories();

    return () => {
      socket.disconnect(); // Clean up Socket.IO connection
    };
  }, [navigate, listId]);

  const handleAddItem = async () => {
    try {
      const serverURL = localStorage.getItem("serverURL");
  
      // Check if a new category needs to be created
      let categoryId = null;
      if (newCategory) {
        const categoryResponse = await fetch(`${serverURL}/api/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            category_name: categoryName,
          }),
        });

        if (!categoryResponse.ok) {
          throw new Error("Failed to create new category");
        }

        const categoryData = await categoryResponse.json();
        categoryId = categoryData.id;

        // Add new category to category options
        setCategoryOptions((prevOptions) => [
          ...prevOptions,
          { value: categoryId, label: categoryName },
        ]);
      } else {
        const selectedCategoryOption = categoryOptions.find(
          (category) => category.label === categoryName
        );
        categoryId = selectedCategoryOption ? selectedCategoryOption.value : null;
      }
  
      // Check if a new item needs to be created
      let itemId = null;
      if (newItem) {
        const itemResponse = await fetch(`${serverURL}/api/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            item_name: itemName,
            category_id: categoryId,
          }),
        });

        if (!itemResponse.ok) {
          throw new Error("Failed to create new item");
        }

        const itemData = await itemResponse.json();
        itemId = itemData.id;

        // Add new item to item options
        setItemOptions((prevOptions) => [
          ...prevOptions,
          { value: itemId, label: itemName },
        ]);
      } else {
        const selectedItemOption = itemOptions.find(
          (item) => item.label === itemName
        );
        itemId = selectedItemOption ? selectedItemOption.value : null;
      }
  
      // Now add the item to the list
      const response = await fetch(
        `${serverURL}/api/lists/list/${list.id}/addItem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: itemId,
            name: itemName,
            quantity: itemQuantity,
            notes: itemNotes,
            category_id: categoryId,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to add item to list");
      }
  
      const updatedList = await response.json();
      setList(updatedList);
      setItemName("");
      setItemQuantity("");
      setItemNotes("");
      setNewItem(false);
      setSelectedItem(null);
      setCategoryName("");
      setNewCategory(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error adding item to list:", error);
      // Handle error
    }
  };  

  const handleDeleteItem = async (itemName) => {
    try {
      const serverURL = localStorage.getItem("serverURL");
      const response = await fetch(
        `${serverURL}/api/lists/list/${list.id}/deleteItem/${itemName}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item from list");
      }
      const updatedList = await response.json();
      setList(updatedList);
    } catch (error) {
      console.error("Error deleting item:", error);
      // Handle error
    }
  };

  const handleItemChange = (newValue, actionMeta) => {
    if (actionMeta.action === "create-option" && newValue) {
      // Handle creating a new item
      setNewItem(true);
      setItemName(newValue.label); // Set item name from selected option
      setSelectedItem(newValue);
    } else if (actionMeta.action === "select-option" && newValue) {
      // Handle selecting an existing item
      setItemName(newValue.label); // Set item name from selected option
      setSelectedItem(newValue);
    } else if (actionMeta.action === "clear") {
      // Handle clear action
      setNewItem(false);
      setItemName(""); // Clear the item name state
      setSelectedItem(null);
    }
  };

  const handleCategoryChange = (newValue, actionMeta) => {
    if (actionMeta.action === "create-option" && newValue) {
      // Handle creating a new item
      setNewCategory(true);
      setCategoryName(newValue.label); // Set item name from selected option
      setSelectedCategory(newValue);
    } else if (actionMeta.action === "select-option" && newValue) {
      // Handle selecting an existing item
      setCategoryName(newValue.label); // Set item name from selected option
      setSelectedCategory(newValue);
    } else if (actionMeta.action === "clear") {
      // Handle clear action
      setNewCategory(false);
      setCategoryName(""); // Clear the item name state
      setSelectedCategory(null);
    }
  };

  if (!list) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <Typography component="h1" variant="h4" gutterBottom>
        List: {list.name}
      </Typography>
      <Box mb={3}>
        <CreatableSelect
          isClearable
          onChange={handleItemChange}
          options={itemOptions}
          value={selectedItem}
        />
        {newItem && (
          <CreatableSelect
            isClearable
            onChange={handleCategoryChange}
            options={categoryOptions}
            value={selectedCategory}
          />
        )}
        <TextField
          label="Quantity"
          name="quantity"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Notes"
          name="notes"
          value={itemNotes}
          onChange={(e) => setItemNotes(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAddItem}>
          Add Item
        </Button>
      </Box>
      <MuiList>
        {list.items.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteItem(item.name)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={item.name}
              secondary={`Quantity: ${item.quantity}, Notes: ${item.notes}`}
            />
          </ListItem>
        ))}
      </MuiList>
    </Container>
  );
};

export default ListPage;
