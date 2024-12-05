import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase"; // Make sure this path is correct
import { onAuthStateChanged } from "firebase/auth";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import CreateIcon from "@mui/icons-material/Create";
import StudentForm from "./StudentForm";
import CreateSheet from "./CreateSheet";
import ModifyStudent from "./ModifyStudent";
import UserSheet from "./UserSheet";
import ViewAttendance from "./ViewAttendance";
import ViewFullAttendance from "./ViewFullAttendance";

const Attendance = () => {
  const [currentView, setCurrentView] = useState("dashboard"); // State to track current view
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/"); // Redirect to login if not authenticated
      } else {
        setIsLoading(false); // Stop showing the loading spinner
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, [navigate]);

  // Styled Button with hover and modern effect
  const CustomButton = styled(Button)(({ theme }) => ({
    width: "100%",
    padding: theme.spacing(1.5),
    textTransform: "none",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(1.5),
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    backgroundColor: "#fff",
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      transform: "translateY(-2px)",
      transition: "all 0.3s ease-in-out",
    },
  }));

  // Render content based on currentView
  const renderContent = () => {
    switch (currentView) {
      case "studentForm":
        return <StudentForm />;
      case "userSheet":
        return <UserSheet />;
      case "viewAttendance":
        return <ViewAttendance />;
      case "modifyStudent":
        return <ModifyStudent />;
      case "viewFullAttendance":
        return <ViewFullAttendance />;
      case "createSheet":
        return <CreateSheet />;
      default:
        return (
          <Paper
            elevation={5}
            sx={{
              padding: 4,
              borderRadius: 3,
              textAlign: "center",
              backgroundColor: "#f9fafc",
            }}
          >
            {/* Header Section */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome to the Attendance Dashboard
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              gutterBottom
              sx={{ marginBottom: 2 }}
            >
              Manage students, classes, and attendance records effortlessly.
            </Typography>
            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box display="flex" flexDirection="column" gap={2}>
              <CustomButton onClick={() => setCurrentView("studentForm")}>
                <PersonAddIcon /> Student Registration
              </CustomButton>
              <CustomButton onClick={() => setCurrentView("userSheet")}>
                <AssignmentIcon /> Class Teacher Login Details
              </CustomButton>
              <CustomButton onClick={() => setCurrentView("viewAttendance")}>
                <VisibilityIcon /> View Attendance (Class Wise)
              </CustomButton>
              <CustomButton
                color="secondary"
                onClick={() => setCurrentView("modifyStudent")}
              >
                <EditIcon /> Modify Student Information
              </CustomButton>
              <CustomButton onClick={() => setCurrentView("viewFullAttendance")}>
                <DataUsageIcon /> Full Attendance Data/Delete
              </CustomButton>
              <CustomButton onClick={() => setCurrentView("createSheet")}>
                <CreateIcon /> Create New Class
              </CustomButton>
            </Box>
          </Paper>
        );
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{ mt: 4, backgroundColor: "#f0f4f8", padding: 3, borderRadius: 2 }}
    >
      {/* Back Button */}
      {currentView !== "dashboard" && (
        <Box mb={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => setCurrentView("dashboard")}
          >
            Back to Dashboard
          </Button>
        </Box>
      )}

      {/* Render Main Content */}
      {renderContent()}
    </Container>
  );
};

export default Attendance;
