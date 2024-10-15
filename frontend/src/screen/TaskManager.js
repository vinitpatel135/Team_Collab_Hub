import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Card, 
    CardContent, 
    CardHeader, 
    Fade, 
    Slide,
    Grid
} from '@mui/material';
import { createTask, getTasks, getUsers } from '../common/api';
import { Link } from 'react-router-dom';

const TaskManager = () => {
    const [title, setTitle] = useState('');
    const [userIds, setUserIds] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const result = await getUsers();
            if (result) {
                setUsers(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        const response = await getTasks();
        setTasks(response.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async () => {
        if (!title || userIds.length === 0) return; 
        const newTask = { title, userIds };
        await createTask(newTask);
        setTitle('');
        setUserIds([]);
        fetchTasks();
    };

    const handleUserChange = (event) => {
        setUserIds(event.target.value);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5, backgroundColor: '#f7f7f7', padding: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#3498db' }}>
                Task Manager
            </Typography>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#616161' }}>
                <Link to="/dashboard" style={{ textDecoration: 'none', color: '#3498db' }}>Back To Dashboard</Link>
            </Typography>

            <Grid container spacing={2} sx={{ padding: '2rem' }}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ marginBottom: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                        <CardHeader 
                            title="Create New Task" 
                            sx={{ backgroundColor: '#3498db', color: '#ffffff' }}
                        />
                        <CardContent>
                            <TextField
                                label="Task Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ '& .MuiOutlinedInput-root': { borderColor: '#3498db' }}}
                            />

                            <FormControl fullWidth margin="normal">
                                <InputLabel>Users</InputLabel>
                                <Select
                                    multiple
                                    value={userIds}
                                    onChange={handleUserChange}
                                    label="Users"
                                    renderValue={(selected) =>
                                        selected
                                            .map((userId) => users.find((user) => user._id === userId)?.name)
                                            .join(', ')
                                    }
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderColor: '#3498db' },
                                        '&:hover .MuiOutlinedInput-root': { borderColor: '#115293' },
                                    }}
                                >
                                    {users.map((user) => (
                                        <MenuItem key={user._id} value={user._id}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleCreateTask} 
                                sx={{ mt: 2, backgroundColor: '#3498db', '&:hover': { backgroundColor: '#115293' }}}
                            >
                                Create Task
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ marginBottom: '20px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', maxHeight: '400px', overflowY: 'auto' }}>
                        <CardHeader 
                            title="Task List" 
                            sx={{ backgroundColor: '#3498db', color: '#ffffff' }}
                        />
                        <CardContent>
                            <Fade in={tasks.length > 0} timeout ={500}>
                                <List sx={{ animation: 'fade-in 1s' }}>
                                    {tasks.map((task) => (
                                        <Slide direction="up" in key={task._id} mountOnEnter unmountOnExit>
                                            <ListItem sx={{ transition: 'background-color 0.3s', '&:hover': { backgroundColor: '#e3f2fd' } }}>
                                                <ListItemText
                                                    primary={task.title}
                                                    secondary={`Assigned to: ${task.userIds.map((userId) =>
                                                        users.find((user) => user._id === userId._id)?.name).join(', ')}`}
                                                />
                                            </ListItem>
                                        </Slide>
                                    ))}
                                </List>
                            </Fade>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TaskManager;