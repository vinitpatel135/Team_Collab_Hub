import React, { useEffect, useState } from 'react';
import { getUsers, getTasks } from '../common/api';
import { useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, FormControl, InputLabel, Select, MenuItem, Container, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const DashboardContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const DashboardHeader = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const DashboardCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 800,
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: 10,
  boxShadow: theme.shadows[5],
}));

const DashboardCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const DashboardButton = styled(Button)(({ theme }) => ({
  width: '10vw',
  // maxWidth: 200,
  margin: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: 10,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const GotoChatButton = styled(Button)(({ theme }) => ({
  width: '10vw',
  // maxWidth: 120,
  margin: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: 10,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedUser , setSelectedUser ] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchUsers();
    fetchTasks();
  }, []);

  const handleChatNavigation = (taskId) => {
    if (!selectedUser ) {
      alert('Please select a user.');
      return;
    }
    navigate(`/task-chat/${taskId}`, { state: { userId: selectedUser  } });
  };

  const handleAddTask = () => {
    navigate('/task-manager');
  };

  const handleAddUser  = () => {
    navigate('/user-manager');
  };

  return (
    <DashboardContainer>
      <DashboardHeader>Dashboard</DashboardHeader>
      <DashboardCard>
        <DashboardCardContent>
          <Typography variant="h6">Users</Typography>
          <List>
            {users.map((user) => (
              <ListItem key={user._id}>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))}
          </List>
          <DashboardButton onClick={handleAddUser }>Add User</DashboardButton>
        </DashboardCardContent>
      </DashboardCard>
      <DashboardCard>
        <DashboardCardContent>
          <Typography variant="h6">Tasks</Typography>
          <List>
            {tasks.map((task) => (
              <ListItem key={task._id}>
                <ListItemText primary={task.title} secondary={`Assigned to: ${task.userIds.map(userId => users.find(user => user._id === userId._id)?.name).join(', ')}`} />
                <FormControl>
                  <InputLabel>User</InputLabel>
                  <Select
                    value={selectedUser }
                    onChange={(e) => setSelectedUser (e.target.value)}
                    label="User "
                    sx={{ minWidth: 150 }}
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <GotoChatButton onClick={() => handleChatNavigation(task._id)}>Go to Chat</GotoChatButton>
              </ListItem>
            ))}
          </List>
          <DashboardButton onClick={handleAddTask}>Add Task</DashboardButton>
        </DashboardCardContent>
      </DashboardCard>
    </DashboardContainer>
  );
};

export default Dashboard;