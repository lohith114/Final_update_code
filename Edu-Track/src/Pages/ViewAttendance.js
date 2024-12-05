import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Box } from '@mui/material';

const ViewAttendance = () => {
  const [todayData, setTodayData] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [trackerSummary, setTrackerSummary] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [logMessage, setLogMessage] = useState("");
  const [viewMode, setViewMode] = useState("today");

  const classes = ["Class1", "Class2", "Class3", "Class4", "Class5", "Class6", "Class7", "Class8", "Class9", "Class10"];

  useEffect(() => {
    if (selectedClass) {
      if (viewMode === "today") {
        fetchTodayData(selectedClass);
      } else if (viewMode === "tracker") {
        fetchTrackerData(selectedClass);
      }
    }
  }, [selectedClass, viewMode]);

  const fetchTodayData = async (classSheet) => {
    try {
      const response = await axios.get(`http://localhost:5000/attendance/current/${classSheet}`);
      setTodayData(response.data.todaySummary);
      setLogMessage(`Today's attendance for ${classSheet} fetched successfully!`);
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
      setLogMessage(`Failed to fetch today's attendance for ${classSheet}.`);
    }
  };

  const fetchTrackerData = async (classSheet) => {
    try {
      const response = await axios.post(`http://localhost:5000/attendance/tracker`, { classSheet });
      setTrackerData(response.data.tracker);
      setTrackerSummary(response.data.summary);
      setLogMessage(`Attendance Data for ${classSheet} fetched successfully!`);
    } catch (error) {
      console.error("Error fetching attendance Data:", error);
      setLogMessage(`Failed to fetch attendance Data for ${classSheet}.`);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setTodayData([]);
    setTrackerData([]);
    setTrackerSummary(null);
    setLogMessage("");
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setTodayData([]);
    setTrackerData([]);
    setTrackerSummary(null);
    setLogMessage("");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary">
        Student Attendance Status
      </Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Class</InputLabel>
        <Select value={selectedClass} onChange={handleClassChange}>
          <MenuItem value="" disabled>Select class</MenuItem>
          {classes.map((className, index) => (
            <MenuItem key={index} value={className}>{className}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 3 }}>
        <Button
          variant={viewMode === "today" ? "contained" : "outlined"}
          onClick={() => handleViewModeChange("today")}
          sx={{ width: '200px', borderRadius: '20px', fontWeight: 'bold' }}
        >
          View Today's Attendance
        </Button>
        <Button
          variant={viewMode === "tracker" ? "contained" : "outlined"}
          onClick={() => handleViewModeChange("tracker")}
          sx={{ width: '200px', borderRadius: '20px', fontWeight: 'bold' }}
        >
          View Attendance Data
        </Button>
      </Box>
      

      {logMessage && (
        <Alert severity={logMessage.includes('failed') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {logMessage}
        </Alert>
      )}

      {viewMode === "today" && selectedClass && (
        <div>
          <Typography variant="h5" gutterBottom>{selectedClass} - Today's Attendance</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Roll Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {todayData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                    <TableCell>{row.rollNumber}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {viewMode === "tracker" && selectedClass && (
        <div>
          <Typography variant="h5" gutterBottom>{selectedClass} - Attendance Data</Typography>
          {trackerSummary && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1"><strong>Total Students:</strong> {trackerSummary.totalStudents}</Typography>
              <Typography variant="body1"><strong>Total Present:</strong> {trackerSummary.totalPresent}</Typography>
              <Typography variant="body1"><strong>Total Absent:</strong> {trackerSummary.totalAbsent}</Typography>
            </Box>
          )}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Roll Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Section</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Present</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Absent</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Attendance Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trackerData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                    <TableCell>{row.rollNumber}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    <TableCell>{row.section}</TableCell>
                    <TableCell>{row.totalPresent}</TableCell>
                    <TableCell>{row.totalAbsent}</TableCell>
                    <TableCell>{row.attendancePercentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </Container>
  );
};

export default ViewAttendance;
