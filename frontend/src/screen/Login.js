import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../common/api';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginUser({ email, password });
      onLoginSuccess(response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Navigate to registration page
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: '30px', marginTop: '50px', borderRadius: '10px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
          Please login to your account to continue.
        </Typography>
        <Grid container spacing={2} marginTop={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleLogin}
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: '10px' }}
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component="button" onClick={handleRegisterRedirect}>
                Create an account
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
