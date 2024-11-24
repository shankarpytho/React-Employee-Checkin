import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Typography,
  TableHead,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  TablePagination, // Import TablePagination
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Header from "./header"; // Import the Header component

const Attendance = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [punchHistory, setPunchHistory] = useState([]); // State for punch history
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [filters, setFilters] = useState({
    employeeName: "",
    logType: "",
    date: "",
    location: "",
  }); // Filter state
  const [locations, setLocations] = useState([]); // State for unique locations
  const [page, setPage] = useState(0); // State for the current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page (10 items per page)

  // Fetch attendance details on component mount
  useEffect(() => {
    const fetchAttendance = async () => {
      const employeeId = localStorage.getItem("userId"); // Get employee ID from localStorage
      const token = localStorage.getItem("accessToken"); // Get access token

      if (!employeeId || !token) {
        setError("Employee ID or token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/checkins/${employeeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPunchHistory(data); // Set punch history from API response

          // Extract unique locations for the location filter
          const uniqueLocations = [...new Set(data.map((entry) => entry.location))];
          setLocations(uniqueLocations);
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch attendance data.");
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchAttendance();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Update the page state
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Set new rows per page
    setPage(0); // Reset to the first page
  };

  // Filtered data based on the filters
  const filteredData = punchHistory.filter((entry) => {
   
    const matchesDate = filters.date
      ? new Date(entry.checkin_time).toLocaleDateString() === new Date(filters.date).toLocaleDateString()
      : true;
    
  
    return  matchesDate
  });
  
  console.log("Filtered Data:", filteredData); // Add this to debug
  

  // Slice the filtered data for pagination
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Include Header here */}
     

      {/* Main content below Header */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
          <Typography variant="h4">Attendance History</Typography>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>

        {/* Filter Controls */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            marginBottom: 3,
          }}
        >
        

         

          <Box sx={{ flex: "1 1 220px" }}>
            <FormControl >
              <TextField
                name="date"
                type="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </FormControl>
          </Box>

        
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            onClick={() => setFilters({ employeeName: "", date: "", location: "" })}
          >
            Clear Filters
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell><strong>Employee Name</strong></TableCell> */}
                    {/* <TableCell><strong>Employee ID</strong></TableCell> */}
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Check-in Time</strong></TableCell>
                    <TableCell><strong>Checkout Time</strong></TableCell>
                    {/* <TableCell><strong>Log Type</strong></TableCell> */}
                    <TableCell><strong>Location</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((entry, index) => {
                      const checkinTime = new Date(entry.checkin_time);
                      const checkoutTime = entry.checkout_time ? new Date(entry.checkout_time) : null;
                      const date = checkinTime.toLocaleDateString();
                      const formattedCheckinTime = checkinTime.toLocaleTimeString();
                      const formattedCheckoutTime = checkoutTime ? checkoutTime.toLocaleTimeString() : "N/A";

                      return (
                        <TableRow key={index}>
                          {/* <TableCell>{entry.employee_name || "N/A"}</TableCell> */}
                          {/* <TableCell>{entry.employee || "N/A"}</TableCell> */}
                          <TableCell>{date}</TableCell>
                          <TableCell>{formattedCheckinTime}</TableCell>
                          <TableCell>{formattedCheckoutTime}</TableCell>
                          {/* <TableCell>{entry.log_type || "N/A"}</TableCell> */}
                          <TableCell>{entry.location || "N/A"}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No punch history available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]} // Options for rows per page
              component="div"
              count={filteredData.length} // Total filtered data count
              rowsPerPage={rowsPerPage} // Current rows per page
              page={page} // Current page number
              onPageChange={handleChangePage} // Handle page change
              onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
            />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Attendance;
