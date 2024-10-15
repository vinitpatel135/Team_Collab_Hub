import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Avatar, 
    Box, 
    Slide, 
    Grid 
} from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';

// const url = "http://localhost:5000"
const url = "https://team-collab-hub.onrender.com"
// const socket = io('https://team-collobration-hub.onrender.com');
const socket = io(url);

const TaskChatRoom = () => {
    const { taskId } = useParams(); 
    const location = useLocation();
    const userId = location.state?.userId; 

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [isSending, setIsSending] = useState(false); 

    // Fetch messages and task users
    useEffect(() => {
        const fetchMessages = async () => {
            const response = await axios.get(`${url}/api/message/${taskId}`);
            setMessages(response.data);
        };

        const fetchTaskUsers = async () => {
            const response = await axios.get(`${url}/api/tasks/${taskId}/users`);
            setUsers(response.data);
        };

        fetchMessages();
        fetchTaskUsers();
    }, [taskId]);

    const sendMessage = async () => {
        if (message.trim() && !isSending) {
            const newMessage = {
                taskId,
                userId,
                content: message,
                timestamp: new Date().toISOString(),
            };

            setIsSending(true); 
            socket.emit('taskMessage', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);

            try {
                await axios.post(`${url}/api/message`, newMessage);
                window.location.reload(); // Avoid using reload, will be managed via socket
            } catch (error) {
                console.error('Error saving message to server', error);
            } finally {
                setMessage(''); 
                setIsSending(false); 
            }
        }
    };

    useEffect(() => {
        socket.emit('joinTaskRoom', { taskId });

        const handleMessage = (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('message', handleMessage); 
        };
    }, [taskId]);

    return (
        <Container maxWidth="lg" sx={{ mt: 5, backgroundColor: '#f7f7f7', padding: '2rem' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: '#3498db' }}>
                Task Chat Room
            </Typography>

            <Grid container spacing={2} sx={{ padding: '2rem' }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6" gutterBottom>
                            Users Assigned to Task
                        </Typography>
                        <List>
                            {users.map((user) => (
                                <ListItem key={user._id}>
                                    <Avatar sx={{ mr: 2 }} />
                                    <ListItemText primary={user.name} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#e3f2fd', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', maxHeight: '400px', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Messages
                        </Typography>
                        <List>
                            {messages.map((msg, index) => (
                                <Slide direction="up" in key={index} mountOnEnter unmountOnExit>
                                    <ListItem>
                                        <ListItemText
                                            primary={msg.content}
                                            secondary={`${msg.userId?.name || 'Unknown'} - ${msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'No time'}`}
                                        />
                                        <Divider />
                                    </ListItem>
                                </Slide>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{ display: 'flex', marginTop: '16px' }}>
                <TextField
                    label=" Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': { 
                            '&:hover fieldset': { borderColor: '#3498db' },
                        }
                    }}
                />
                <Button 
                    onClick={sendMessage} 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginLeft: '8px', backgroundColor: '#3498db', '&:hover': { backgroundColor: '#115293' } }}
                >
                    Send
                </Button>
            </Box>
        </Container>
    );
};

export default TaskChatRoom;
