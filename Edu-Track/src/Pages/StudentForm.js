import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Tooltip,
} from "@mui/material";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    Class: "",
    RollNumber: "",
    NameOfTheStudent: "",
    ParentEmail: "",
    Section: "",
  });

  const [loading, setLoading] = useState(false); // For submit button loading state
  const [errors, setErrors] = useState({}); // For inline validation errors

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.Class) newErrors.Class = "Class is required";
    if (!formData.RollNumber.trim()) newErrors.RollNumber = "Roll Number is required";
    if (!formData.NameOfTheStudent.trim()) newErrors.NameOfTheStudent = "Student Name is required";
    if (!formData.ParentEmail.trim()) newErrors.ParentEmail = "Parent's Gmail ID is required";
    if (!formData.Section.trim()) newErrors.Section = "Section is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API request to save data
  const saveToGoogleSheet = async (data) => {
    setLoading(true);
    try {
      // Make a POST request to the backend to save student data
      const response = await axios.post("http://localhost:5000/save", data, {
        headers: {
          "Content-Type": "application/json",
          // Ensure token/authorization headers are set if required
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      
      if (response.status === 200) {
        alert(response.data.message); // Success message from backend
      } else {
        alert("Failed to save data. Please try again."); // Handling any errors
      }

      // Reset form after submission
      setFormData((prevData) => ({
        ...prevData,
        RollNumber: "",
        NameOfTheStudent: "",
        ParentEmail: "",
        Section: "",
      }));
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      saveToGoogleSheet(formData);
    }
  };

  // Handle form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error on change
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        margin: "3rem auto",
        padding: 4,
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        fontWeight="bold"
        color="primary"
      >
        Student Attendance Registration
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
        Fill in the form below to register student details for attendance tracking.
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Class Selector */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={Boolean(errors.Class)}>
              <InputLabel>Select Class</InputLabel>
              <Select
                name="Class"
                value={formData.Class}
                onChange={handleChange}
                label="Select Class"
              >
                <MenuItem value="" disabled>
                  Select class
                </MenuItem>
                {Array.from({ length: 10 }, (_, i) => (
                  <MenuItem key={i + 1} value={`Class${i + 1}`}>
                    Class{i + 1}
                  </MenuItem>
                ))}
              </Select>
              {errors.Class && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.Class}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Roll Number */}
          <Grid item xs={12} sm={6}>
            <Tooltip title="Enter Roll Number" arrow>
              <TextField
                fullWidth
                label="Roll Number"
                name="RollNumber"
                value={formData.RollNumber}
                onChange={handleChange}
                placeholder="Enter roll number"
                variant="outlined"
                error={Boolean(errors.RollNumber)}
                helperText={errors.RollNumber || " "}
              />
            </Tooltip>
          </Grid>

          {/* Name of the Student */}
          <Grid item xs={12} sm={6}>
            <Tooltip title="Enter the student's full name" arrow>
              <TextField
                fullWidth
                label="Name of the Student"
                name="NameOfTheStudent"
                value={formData.NameOfTheStudent}
                onChange={handleChange}
                placeholder="Enter student's name"
                variant="outlined"
                error={Boolean(errors.NameOfTheStudent)}
                helperText={errors.NameOfTheStudent || " "}
              />
            </Tooltip>
          </Grid>

          {/* Parent's Gmail ID */}
          <Grid item xs={12} sm={6}>
            <Tooltip title="Enter the parent's Gmail ID" arrow>
              <TextField
                fullWidth
                label="Parent's Gmail ID"
                name="ParentEmail"
                value={formData.ParentEmail}
                onChange={handleChange}
                placeholder="Enter parent's Gmail ID"
                variant="outlined"
                error={Boolean(errors.ParentEmail)}
                helperText={errors.ParentEmail || " "}
              />
            </Tooltip>
          </Grid>

          {/* Section */}
          <Grid item xs={12}>
            <Tooltip title="Enter the section (e.g., A, B, etc.)" arrow>
              <TextField
                fullWidth
                label="Section"
                name="Section"
                value={formData.Section}
                onChange={handleChange}
                placeholder="Enter section"
                variant="outlined"
                error={Boolean(errors.Section)}
                helperText={errors.Section || " "}
              />
            </Tooltip>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !formData.Class || !formData.RollNumber || !formData.NameOfTheStudent || !formData.ParentEmail || !formData.Section}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: "16px",
                fontWeight: "bold",
                boxShadow: loading ? "none" : "0px 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default StudentForm;
