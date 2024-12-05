import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/Firebase'; // Ensure the correct path to Firebase setup
import { Box, Button, Typography, Grid, CircularProgress } from '@mui/material';
import ExamTimeTable from './ExamTimeTable'; // Upload Timetable Component
import ExamTimeTableView from './ExamTimeTableView'; // View Timetable Component

const ExamDashboard = () => {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'upload', 'view'
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/'); // Redirect to login if not authenticated
      } else {
        setAuthLoading(false); // Stop loading once authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]);

  const handleTimetableUpload = () => setView('upload');
  const handleTimetableView = () => setView('view');
  const handleBackToDashboard = () => setView('dashboard');

  if (authLoading) {
    // Show a loading spinner while checking authentication
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Shared Buttons for Navigation */}
      {view === 'dashboard' && (
        <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 4 }}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTimetableUpload}
              sx={{ padding: '10px 20px' }}
            >
              Exam Timetable Upload
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={handleTimetableView}
              sx={{ padding: '10px 20px' }}
            >
              View Timetable
            </Button>
          </Grid>
        </Grid>
      )}

      {/* View Logic */}
      {view === 'dashboard' ? (
        <Typography variant="h5" align="center">
          Please select an action from the buttons above.
        </Typography>
      ) : view === 'upload' ? (
        <>
          <ExamTimeTable />
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackToDashboard}
              sx={{ padding: '10px 20px' }}
            >
              Back to Exam Dashboard
            </Button>
          </Box>
        </>
      ) : view === 'view' ? (
        <>
          <ExamTimeTableView />
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackToDashboard}
              sx={{ padding: '10px 20px' }}
            >
              Back to Exam Dashboard
            </Button>
          </Box>
        </>
      ) : null}
    </Box>
  );
};

export default ExamDashboard;
