import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';

const CreateEmployee = () => {
    const [rollId, setRollId] = useState(localStorage.getItem("userId") || "");
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: '', // To store the selected role (admin or employee)
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, role } = formData;

        const adminIdInt = parseInt(rollId, 10); // Converts rollId to an integer

        if (isNaN(adminIdInt)) {
            setError('Invalid admin ID');
            return;
        }

        const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

        const apiUrl = role === 'admin'
            ? `${API_BASE_URL}/create-superuser/`
            : `${API_BASE_URL}/create-employee/`;

        const payload = {
            username,
            password,
            admin_id: adminIdInt,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to create employee or admin');
            }

            const data = await response.json();
            setSuccess('Employee/Admin created successfully');
            setFormData({
                username: '',
                password: '',
                role: '',
            });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '50px', // Adds space above the form
                minHeight: '80vh', // Ensures full height of the viewport for centering
            }}
        >
            <Paper
                sx={{
                    padding: '20px',
                    maxWidth: '500px',
                    // backgroundColor: '#121212',
                    borderRadius: '10px',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 'auto',
                    height: 'auto',
                    minHeight: '400px',
                }}
            >
                <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' , color:'#000' }}>
                    Create Employee or Admin
                </Typography>
                {error && <Typography color="error" align="center">{error}</Typography>}
                {success && <Typography color="success" align="center">{success}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Username */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
                            />
                        </Grid>

                        {/* Password */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
                            />
                        </Grid>

                        {/* Role Dropdown */}
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    label="Role"
                                    sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
                                >
                                    <MenuItem value="employee">Employee</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    backgroundColor: '#6200ea',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#3700b3',
                                    },
                                    padding: '12px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                }}
                            >
                                Create {formData.role === 'admin' ? 'Admin' : 'Employee'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default CreateEmployee;
