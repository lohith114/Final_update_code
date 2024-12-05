import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/Firebase'; // Update path if needed
import {
    Box,
    Button,
    Typography,
    Grid,
    CircularProgress
} from '@mui/material';
import TimetableGenerator from './TimetableGenerator'; // Import the generator code
import TimetableUpload from './TimeTableUpload'; // Import the upload code
import TimeTableView from './TimeTableView'; // Import the TimeTableView component

const TimeTable = () => {
    const [authLoading, setAuthLoading] = useState(true);
    const [view, setView] = useState('timetable'); // 'timetable', 'generator', 'upload', or 'view'
    const navigate = useNavigate();

    const handleTimetableGenerator = () => setView('generator');
    const handleTimetableUpload = () => setView('upload');
    const handleTimetableView = () => setView('view');
    const handleBackToTimetable = () => setView('timetable');

    // Authentication check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate("/"); // Redirect to login page if not authenticated
            } else {
                setAuthLoading(false); // Allow component to render for authenticated users
            }
        });

        return () => unsubscribe(); // Cleanup on component unmount
    }, [navigate]);

    if (authLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            {/* Shared Buttons */}
            <Grid container spacing={2} justifyContent="center" sx={{ marginBottom: 4 }}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleTimetableGenerator}
                        sx={{ padding: '10px 20px' }}
                    >
                        Timetable Generator
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleTimetableUpload}
                        sx={{ padding: '10px 20px' }}
                    >
                        Timetable Upload
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

            {/* View Logic */}
            {view === 'timetable' ? (
                <Typography variant="h5" align="center">
                    Please select an action from the buttons above.
                </Typography>
            ) : view === 'generator' ? (
                <>
                    <TimetableGenerator />
                    <Box textAlign="center" mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBackToTimetable}
                            sx={{ padding: '10px 20px' }}
                        >
                            Back to TimeTable Home Page
                        </Button>
                    </Box>
                </>
            ) : view === 'upload' ? (
                <>
                    <TimetableUpload />
                    <Box textAlign="center" mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBackToTimetable}
                            sx={{ padding: '10px 20px' }}
                        >
                            Back to Weekly Timetable
                        </Button>
                    </Box>
                </>
            ) : view === 'view' ? (
                <>
                    <TimeTableView />
                    <Box textAlign="center" mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBackToTimetable}
                            sx={{ padding: '10px 20px' }}
                        >
                            Back to Weekly Timetable
                        </Button>
                    </Box>
                </>
            ) : null}
        </Box>
    );
};

export default TimeTable;
