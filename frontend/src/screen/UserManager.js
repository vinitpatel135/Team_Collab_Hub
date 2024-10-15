import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    Paper, 
    Slide, 
    Divider, 
    Box, 
    Snackbar,
    Alert,
    AppBar,
    Toolbar,
    CssBaseline,
    Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import axios from 'axios'; // Ensure you have axios installed for API calls

// const url = "http://localhost:5000"
const url = "https://team-collab-hub.onrender.com"

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${url}/api/users`);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser  = async () => {
        if (newUserName.trim() && newUserEmail.trim() && newUserPassword.trim()) {
            const newUser = { name: newUserName, email: newUserEmail, password: newUserPassword };
            try {
                const response = await axios.post(`${url}/api/users/register`, newUser);
                setUsers((prevUsers) => [...prevUsers, response.data]);
                setNewUserName('');
                setNewUserEmail('');
                setNewUserPassword('');

                setSnackbarMessage('User  created successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error creating user:', error);
                setSnackbarMessage('Error creating user. Please try again.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } else {
            setSnackbarMessage('Please fill all fields.');
            setSnackbarSeverity('warning');
            setSnackbarOpen(true);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container component="main" maxWidth="lg" sx={{ marginTop: '2rem', backgroundColor: '#f7f7f7', padding: '2rem' }}>
            <CssBaseline />
            <AppBar position="static" sx={{ backgroundColor: '#3498db', color: '#ffffff' }}>
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        User Management
                    </Typography>
                </Toolbar>
            </AppBar>

            <Grid container spacing={2} sx={{ padding: '2rem' }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#3498db' }}>
                            Create New User
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
                            <TextField
                                label="Name"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '8px', backgroundColor: '#f7f7f7', borderRadius: '5px' }}
                            />
                            <TextField
                                label="Email"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '8px', backgroundColor: '#f7f7f7', borderRadius: '5px' }}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={newUserPassword}
                                onChange={(e) => setNewUserPassword(e.target.value)}
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '8px', backgroundColor: '#f7f7f7', borderRadius: '5px' }}
                            />
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleAddUser } 
                                startIcon={<AddIcon />}
                                sx={{ marginTop: '16px', backgroundColor: '#3498db', color: '#ffffff', borderRadius: '5px' }}
 >
                                Add User
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', maxHeight: '400px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#3498db' }}>
                            User List
                        </Typography>
                        <List>
                            {users.map((user) => (
                                <Slide direction="up" in key={user._id} mountOnEnter unmountOnExit>
                                    <ListItem>
                                        <ListItemText 
                                            primary={user.name} secondary={user.email} 
                                            primaryTypographyProps={{ fontWeight: 'bold', color: '#3498db' }}
                                        />
                                        <Divider />
                                    </ListItem>
                                </Slide>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Snackbar for notifications */}
            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ backgroundColor: snackbarSeverity === 'success' ? '#2e865f' : snackbarSeverity === 'error' ? '#e74c3c' : '#f7dc6f', color: '#ffffff' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserManager;
