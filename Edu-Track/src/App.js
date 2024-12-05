import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './Firebase/Firebase';

import Sidebar from './Components/Sidebar';
import Welcome from './Components/Welcome';
import ProfileInfo from './Components/ProfileInfo';

import SchoolInfo from './Pages/SchoolInfo';
import FeePortal from './Pages/FeePortal';
import Attendance from './Pages/Attendance';
import TimeTable from './Pages/TimeTable';
import ExamTimeTable from './Pages/ExamTimeTable';
import ExamTimeTableView from './Pages/ExamTimeTableView'; // Import ExamTimeTableView
import ExamDashboard from './Pages/ExamDashboard'; // Import ExamDashboard
import Login from './Components/Login';

// Material-UI imports
import { CssBaseline, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#282c34',
    },
    secondary: {
      main: '#61dafb',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(60); // Default collapsed width

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(user !== null);
    });
    return () => unsubscribe();
  }, []);

  const handleSidebarToggle = (isExpanded) => {
    setSidebarWidth(isExpanded ? 240 : 60);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box display="flex">
          {isAuthenticated && (
            <Box width={sidebarWidth}>
              <Sidebar onToggle={handleSidebarToggle} />
            </Box>
          )}
          <Box sx={{ ml: `${sidebarWidth}px`, transition: 'margin 0.3s', width: `calc(100% - ${sidebarWidth}px)` }}>
            <Routes>
              <Route path="/Edu-Track" element={<Login />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/profileinfo" element={<ProfileInfo />} />
              <Route path="/fee-portal" element={<FeePortal />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/time-table" element={<TimeTable />} />
              <Route path="/exam-timetable-upload" element={<ExamTimeTable />} />
              <Route path="/exam-timetable-view" element={<ExamTimeTableView />} /> {/* New route for ExamTimeTableView */}
              <Route path="/exam-dashboard" element={<ExamDashboard />} /> {/* Add Exam Dashboard route */}
              <Route path="/school-info" element={<SchoolInfo />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
