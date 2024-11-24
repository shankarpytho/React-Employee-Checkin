import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Menu as MenuIcon, Add as AddIcon } from "@mui/icons-material"; // Importing Plus Icon
import { Link, useNavigate } from "react-router-dom";

const Header = ({ onLogout }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [userRole, setUserRole] = useState(localStorage.getItem("userId") || "employee"); // Set the role from localStorage
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for Drawer
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setUserRole(localStorage.getItem("role") || "employee");
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  // Menu items for Admin and Employee based on role
  const adminMenuItems = [
    { text: "User Creation", path: "/create-employee", icon: <AddIcon /> }, // Admin menu item with Plus Icon
  ];

  const employeeMenuItems = [
    { text: "Dashboard", path: "/home" },
    { text: "Attendance", path: "/attendance" },
  ];

  // Determine which menu to show based on role
  const menuItems = userRole === "admin" ? adminMenuItems : employeeMenuItems;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome {username}
          </Typography>

          {/* Menu for larger screens */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                component={Link}
                to={item.path}
                color="inherit"
                sx={{ marginRight: 2 }}
                startIcon={item.icon || null} // Add icon if exists
              >
                {item.text}
              </Button>
            ))}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          {/* Menu Icon for smaller screens */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for small screens */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
