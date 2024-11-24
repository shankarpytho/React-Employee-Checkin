import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  Snackbar,
  Alert, // Import Alert for enhanced Snackbar styling
} from "@mui/material";

const Dashboard = () => {
 // States for user and app data
 const [rollNo, setRollNo] = useState(localStorage.getItem("userId") || "");
 const [username, setUsername] = useState(localStorage.getItem("username") || "");
 const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");

 // Time and date states
 const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
 const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
 const [currentDay, setCurrentDay] = useState(
   new Date().toLocaleString("en-us", { weekday: "long" })
 );

 // Punch states
 const [punchInTime, setPunchInTime] = useState(localStorage.getItem("punchInTime") || null);
 const [punchOutTime, setPunchOutTime] = useState(localStorage.getItem("punchOutTime") || null);
 const [checkinId, setCheckinId] = useState(localStorage.getItem("checkinId") || null);
 const [isPunchedIn, setIsPunchedIn] = useState(localStorage.getItem("isPunchedIn") === "true");

 // Location state
 const [location, setLocation] = useState("Fetching location...");

 // Snackbar states
 const [snackbarMessage, setSnackbarMessage] = useState("");
 const [snackbarOpen, setSnackbarOpen] = useState(false);
 const [snackbarSeverity, setSnackbarSeverity] = useState("success");

 // Update time, date, and fetch location on mount
 useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    setCurrentDate(new Date().toLocaleDateString());
    setCurrentDay(new Date().toLocaleString("en-us", { weekday: "long" }));
  }, 1000);

  // Fetch user location and convert to address
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Fetch human-readable address using Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            // Update location with city and state if available
            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state || "";
            const country = data.address.country || "";

            setLocation(`${city || "Unknown"}, ${state}, ${country}`.trim());
          } else {
            setLocation("Unable to fetch location");
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
          setLocation("Unable to fetch location");
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setLocation("Unable to fetch location");
      }
    );
  } else {
    setLocation("Geolocation not supported");
  }

  return () => clearInterval(timer);
}, []);

  // Handler to close the Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handler for Punch In
  const handlePunchIn = async () => {
    const checkinTime = new Date().toISOString(); // ISO format for the current time
    const employeeId = rollNo; // Retrieved from localStorage
    const employeeName = username; // Retrieved from localStorage
    const token = accessToken;

    const payload = {
      employee: employeeId,
      employee_name: employeeName,
      checkin_time: checkinTime,
      location: location,
      created_by: employeeName,
      modified_by: employeeName,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/checkin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Punch In Successful:", data);
        setCheckinId(data.checkin_id);
        setPunchInTime(new Date().toLocaleTimeString()); // Update punch-in time in state
        setIsPunchedIn(true); // Set punched-in status

        // Save state to localStorage
        localStorage.setItem("checkinId", data.checkin_id);
        localStorage.setItem("punchInTime", new Date().toLocaleTimeString());
        localStorage.setItem("isPunchedIn", "true");

        // Update Snackbar for success
        setSnackbarMessage("Punch In successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true); // Open the Snackbar
      } else {
        console.error("Punch In Failed:", await response.text());
        setSnackbarMessage("Failed to punch in. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true); // Open the Snackbar
      }
    } catch (error) {
      console.error("Error during Punch In:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Open the Snackbar
    }
  };

  // Handler for Punch Out
  const handlePunchOut = async () => {
    if (!checkinId) {
      setSnackbarMessage("No Check-In ID found. Please Punch In first.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Open the Snackbar
      return;
    }

    const checkoutTime = new Date().toISOString(); // ISO format for the current time
    const employeeIdInt = parseInt(rollNo, 10);// Retrieved from localStorage
    const employeeName = username; // Retrieved from localStorage
    const token = accessToken;

    const payload = {
      employee: employeeIdInt,
      checkin_id: checkinId, // Pass the checkin ID
      employee_name: employeeName,
      checkout_time: checkoutTime,
      location: location,
      created_by: employeeName,
      modified_by: employeeName,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/checkout/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Punch Out Successful:", data);
        setPunchOutTime(new Date().toLocaleTimeString()); // Update punch-out time in state
        setIsPunchedIn(false); // Reset punched-in status
        setCheckinId(null); // Clear the checkin ID after checkout

        // Clear punch-in data from localStorage
        localStorage.removeItem("checkinId");
        localStorage.removeItem("punchInTime");
        localStorage.setItem("isPunchedIn", "false");

        // Update Snackbar for success
        setSnackbarMessage("Punch Out successful!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true); // Open the Snackbar
      } else {
        console.error("Punch Out Failed:", await response.text());
        setSnackbarMessage("Failed to punch out. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true); // Open the Snackbar
      }
    } catch (error) {
      console.error("Error during Punch Out:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Open the Snackbar
    }
  };

  // Optional: Test Snackbar independently
  // Uncomment the following function and button to test Snackbar functionality
  /*
  const handleTestSnackbar = () => {
    setSnackbarMessage("Test Snackbar!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };
  */

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "90vh", // Ensure the container takes the full height of the viewport
      overflow: "hidden", // Prevents scrolling on the outer container
    }}
  >
    {/* Main Content */}
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#f7f9fc", // Light background
        paddingTop: '20px',
        overflowY: "auto", // Allow scrolling in this area only if needed
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: "80%", md: "60%", lg: "40%" }, // Responsive width
          padding: 3,
          borderRadius: 4,
          boxShadow: 3,
          maxHeight: "80vh", // Ensure the card doesn't grow too large
          overflowY: "auto", // Allow scrolling within the card if content exceeds the height
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome {username}!
          </Typography>
  
          <Box
            sx={{
              padding: 3,
              backgroundColor: "#f0f0f0",
              borderRadius: 2,
              boxShadow: 1,
              maxHeight: "60vh", // Limit the height of the content box to avoid overflow
              overflowY: "auto", // Allow scrolling inside this box if the content is too long
            }}
          >
            <Typography variant="h6" color="text.primary" gutterBottom>
              Current Punch Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Current Time: <strong>{currentTime}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Current Date: <strong>{currentDate}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Current Day: <strong>{currentDay}</strong>
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Current Location: <strong>{location}</strong>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Punch In Time: <strong>{punchInTime || "Not punched in"}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Punch Out Time: <strong>{punchOutTime || "Not punched out"}</strong>
            </Typography>
  
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={isPunchedIn} // Disable Punch In if already punched in
                onClick={handlePunchIn}
              >
                Punch In
              </Button>
            </Box>
  
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                disabled={!isPunchedIn} // Disable Punch Out if not punched in
                onClick={handlePunchOut}
              >
                Punch Out
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  
    {/* Snackbar */}
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }} // Centered Snackbar
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbarSeverity} // 'success' or 'error'
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  
   
  </Box>
  
  );
};

export default Dashboard;
