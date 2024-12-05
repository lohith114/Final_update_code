// src/Components/Header.js

import React, { useState } from 'react';
import { auth } from '../Firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import logo from './Logo_LMKS (1).png';

function Header() {
    const [isDropdownVisible, setIsDropdownVisible] = useState(null); // Changed to Menu anchor element
    const user = auth.currentUser;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/Edu-Track'); // Redirect to login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleDropdown = (event) => {
        setIsDropdownVisible(event.currentTarget); // Sets anchor for dropdown
    };

    const closeDropdown = () => {
        setIsDropdownVisible(null); // Close dropdown
    };

    const goToProfileInfo = () => {
        navigate('/profileinfo'); // Navigate to ProfileInfo page
        closeDropdown();
    };

    // Fallback URL for profile picture if the user doesn't have a profile photo
    const defaultProfilePic = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKDnI9ruH113ERMUf-pnbwqQea-AXP1FrF46jtxwOb4w0UXRTqLpCAsMuAnBJNUGpZ2EI&usqp=CAU";

    return (
        <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            p={2} 
            bgcolor="primary.main" 
            color="white" 
            width="100%" 
            position="fixed" 
            top={0} 
            left={0} 
            zIndex={1000} 
            boxShadow={2}
        >
            <Box display="flex" alignItems="center">
                <img src={logo} alt="Logo" style={{ width: '80px', height: 'auto', borderRadius: '10px' }} />
            </Box>
            
            {user && (
                <Box display="flex" alignItems="center" position="relative">
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {user.email}
                    </Typography>
                    <IconButton 
                        onClick={toggleDropdown} 
                        sx={{ p: 0, ml: 2 }}
                    >
                        <img 
                            src={user.photoURL || defaultProfilePic} 
                            alt="Profile" 
                            style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                    </IconButton>
                    
                    <Menu
                        anchorEl={isDropdownVisible}
                        open={Boolean(isDropdownVisible)}
                        onClose={closeDropdown}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={goToProfileInfo}>Profile Info</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            )}
        </Box>
    );
}

export default Header;