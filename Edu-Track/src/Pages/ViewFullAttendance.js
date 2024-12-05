import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

const ViewFullAttendance = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logMessage, setLogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const classes = ["Class1", "Class2", "Class3", "Class4", "Class5", "Class6", "Class7", "Class8", "Class9", "Class10"];

  useEffect(() => {
    if (selectedClass) {
      fetchAttendanceData(selectedClass);
    }
  }, [selectedClass]);

  const fetchAttendanceData = async (classSheet) => {
    setLoading(true);
    setLogMessage("");
    try {
      const response = await axios.get(`http://localhost:5000/attendance/full/${classSheet}`);
      setAttendanceData(response.data.attendanceData);
      setLogMessage(`Full attendance sheet for ${classSheet} fetched successfully!`);
    } catch (error) {
      console.error("Error fetching full attendance sheet:", error);
      setLogMessage(`Failed to fetch full attendance sheet for ${classSheet}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setAttendanceData([]);
    setLogMessage("");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    setLoading(true);
    setLogMessage("");
    try {
      await axios.delete(`http://localhost:5000/attendance/full/${selectedClass}`);
      setAttendanceData([]);
      setLogMessage(`Full attendance sheet for ${selectedClass} deleted successfully!`);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting full attendance sheet:", error);
      setLogMessage(`Failed to delete full attendance sheet for ${selectedClass}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6, backgroundColor: '#f7f7f7', borderRadius: '8px', boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold" color="primary" sx={{ mb: 3 }}>
        Full Attendance Sheet
      </Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Class</InputLabel>
        <Select
          value={selectedClass}
          onChange={handleClassChange}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ccc' },
              '&:hover fieldset': { borderColor: '#4caf50' },
            },
          }}
        >
          <MenuItem value="" disabled>Select class</MenuItem>
          {classes.map((className, index) => (
            <MenuItem key={index} value={className} sx={{ backgroundColor: '#f1f1f1', borderRadius: '5px', marginBottom: '4px' }}>
              {className}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {logMessage && (
        <Alert severity={logMessage.includes('failed') ? 'error' : 'success'} sx={{ mb: 2 }}>
          {logMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {attendanceData.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrint}
                sx={{
                  borderRadius: '20px',
                  padding: '10px 20px',
                  '&:hover': { backgroundColor: '#388e3c' }
                }}
              >
                Print
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleOpenDialog}
                sx={{
                  borderRadius: '20px',
                  padding: '10px 20px',
                  '&:hover': { backgroundColor: '#d32f2f' }
                }}
              >
                Delete
              </Button>
            </Box>
          )}

          <TableContainer component={Paper} sx={{ borderRadius: '8px' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: '#e8f5e9' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Roll Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Student Name</TableCell>
                  {attendanceData.length > 0 && attendanceData[0].dates.map((date, index) => (
                    <TableCell key={index} sx={{ fontWeight: 'bold', color: '#388e3c' }}>{date}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    sx={{
                      '&:hover': { backgroundColor: '#f1f1f1' },
                      backgroundColor: rowIndex % 2 === 0 ? '#fafafa' : '#fff',
                    }}
                  >
                    <TableCell>{row.rollNumber}</TableCell>
                    <TableCell>{row.studentName}</TableCell>
                    {row.statuses.map((status, index) => (
                      <TableCell key={index}>{status}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>Delete Attendance Sheet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the full attendance sheet for {selectedClass}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewFullAttendance;
