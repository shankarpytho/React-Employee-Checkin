import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination } from "@mui/material";

const EmployeeHistory = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    employeeName: "",
    employeeId: "",
    location: "",
    date: ""
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const response = await fetch(`${API_BASE_URL}/admin/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ id: parseInt(localStorage.getItem("userId"), 10) }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employee data.");
        }

        const data = await response.json();
        setEmployeeData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const filteredData = employeeData.filter((item) => {
    return (
      (filters.employeeName ? item.employee_name.toLowerCase().includes(filters.employeeName.toLowerCase()) : true) &&
      (filters.employeeId ? parseInt(item.employee, 10) === parseInt(filters.employeeId, 10) : true) &&
      (filters.location ? item.location.toLowerCase().includes(filters.location.toLowerCase()) : true) &&
      (filters.date ? new Date(item.checkin_time).toLocaleDateString() === new Date(filters.date).toLocaleDateString() : true)
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      employeeName: "",
      employeeId: "",
      location: "",
      date: ""
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" align="center">Error: {error}</Typography>;
  }

  return (
    <Box style={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Employee History
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        This page is only accessible to admins.
      </Typography>

      {/* Filter Section */}
      <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '16px' }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search by Employee Name"
            variant="outlined"
            name="employeeName"
            value={filters.employeeName}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search by Employee ID"
            variant="outlined"
            name="employeeId"
            type="number"
            value={filters.employeeId}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search by Location"
            variant="outlined"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Filter by Date"
            variant="outlined"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      {/* Clear Filter Button */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Button variant="outlined" color="secondary" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} style={{ maxHeight: '500px', overflowX: 'auto' }}>
        <Table aria-label="employee history table">
          <TableHead>
            <TableRow>
              <TableCell>Employee Name</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Check-in Date</TableCell>
              <TableCell>Check-out Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
              <TableRow key={employee.checkin_id}>
                <TableCell>{employee.employee_name || "N/A"}</TableCell>
                <TableCell>{employee.employee}</TableCell>
                <TableCell>{employee.location}</TableCell>
                <TableCell>{new Date(employee.checkin_time).toLocaleString()}</TableCell>
                <TableCell>{new Date(employee.checkout_time).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">No employee data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <TablePagination
        rowsPerPageOptions={[5]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ marginTop: '16px' }}
      />
    </Box>
  );
};

export default EmployeeHistory;
