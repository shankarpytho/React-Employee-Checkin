import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";

const LoginPage = () => {
  const [username, setUsername] = useState(""); // Changed to username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Access the environment variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Use username instead of email
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Access Token:", data.user_token.access);
        console.log("Refresh Token:", data.user_token.refresh);
      
        // Save tokens to localStorage
        localStorage.setItem("accessToken", data.user_token.access);
        localStorage.setItem("refreshToken", data.user_token.refresh);
      
        // Save user information (id and username) to localStorage
        localStorage.setItem("userId", data.user.id); // Save id (roll number)
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("role", data.user.role); // Store the role
         // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/employee-history");
      } else {
        navigate("/home");
      }
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 400,
        }}
      >
        <Typography component="h1" variant="h5" textAlign="center" gutterBottom>
          Sign In
        </Typography>

        {error && (
          <Typography color="error" textAlign="center">
            {error}
          </Typography>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username" // Updated label
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
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

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Link href="#" variant="body2">
              Forgot password?
            </Link>

            {/* <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link> */}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
