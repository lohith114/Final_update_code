import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './Firebase/Firebase';

import Sidebar from './Components/Sidebar';
import Welcome from './Components/Welcome';
import ProfileInfo from './Components/ProfileInfo';

import SchoolInfo from './Pages/SchoolInfo';
import ManageFeeStatus from './Pages/ManageFeeStatus';
import Attendance from './Pages/Attendance';
import TimeTable from './Pages/TimeTable';
import ExamTimeTable from './Pages/ExamTimeTable';
import ExamTimeTableView from './Pages/ExamTimeTableView';
import ExamDashboard from './Pages/ExamDashboard';
import Login from './Components/Login';
import AllStudents from './Pages/AllStudents';

import Addexamreport from './Pages/Addexamreport';
import Report from './Pages/Report';
import MainPage from './Pages/MainPage';

import TimetableGenerator from './Pages/TimetableGenerator';
import TimetableUpload from './Pages/TimeTableUpload'; // Ensure the import path matches the file name exactly
import TimeTableView from './Pages/TimeTableView';  // Adjusted import path if necessary

import { CssBaseline, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RegistrationForm from './Pages/RegistrationForm';

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
  const [sidebarWidth, setSidebarWidth] = useState(60);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(user !== null);
    });
    return () => unsubscribe();
  }, []);

  const handleSidebarToggle = (isExpanded) => {
    setSidebarWidth(isExpanded ? 240 : 60);
  };

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/Edu-Track" />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box display="flex" flexDirection="row" sx={{ height: '100vh', width: '100%' }}>
          {isAuthenticated && (
            <Box
              width={sidebarWidth}
              sx={{
                transition: 'width 0.3s ease',
                height: '100vh',
              }}
            >
              <Sidebar onToggle={handleSidebarToggle} />
            </Box>
          )}

          <Box
            sx={{
              ml: `${sidebarWidth}px`,
              transition: 'margin-left 0.3s ease',
              flexGrow: 1,
              padding: 3,
              height: '100vh',
              mr: 10,
            }}
          >
            <Routes>
              <Route path="/Edu-Track" element={<Login />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/profileinfo" element={<ProfileInfo />} />
              <Route path="/Manage-Fee-Status" element={<PrivateRoute element={<ManageFeeStatus />} />} />
              <Route path="/attendance" element={<PrivateRoute element={<Attendance />} />} />
              <Route path="/time-table" element={<PrivateRoute element={<TimeTable />} />} />
              <Route path="/exam-timetable-upload" element={<PrivateRoute element={<ExamTimeTable />} />} />
              <Route path="/exam-timetable-view" element={<PrivateRoute element={<ExamTimeTableView />} />} />
              <Route path="/exam-dashboard" element={<PrivateRoute element={<ExamDashboard />} />} />
              <Route path="/school-info" element={<PrivateRoute element={<SchoolInfo />} />} />
              <Route path="/Student-Registration" element={<PrivateRoute element={<RegistrationForm />} />} />
              <Route path="/View-Registered-Students" element={<PrivateRoute element={<AllStudents />} />} />
              <Route path="/marks-management" element={<PrivateRoute element={<MainPage />} />} />
              <Route path="/addexamreport" element={<PrivateRoute element={<Addexamreport />} />} />
              <Route path="/report" element={<PrivateRoute element={<Report />} />} />
              <Route path="/" element={<PrivateRoute element={<TimeTable />} />} />
              <Route path="/generator" element={<PrivateRoute element={<TimetableGenerator />} />} />
              <Route path="/upload" element={<PrivateRoute element={<TimetableUpload />} />} />
              <Route path="/view" element={<PrivateRoute element={<TimeTableView />} />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
