import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Box,
} from '@mui/material';
import {
    Home,
    School,
    Payment,
    CalendarToday,
    CloudUpload,
    TableChart,
    Menu,
    Close,
} from '@mui/icons-material';

const Sidebar = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true); // User is authenticated
            } else {
                setIsAuthenticated(false); // User is not authenticated
                navigate('/'); // Redirect to login
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // Render nothing until authentication status is confirmed
    if (!isAuthenticated) {
        return null;
    }

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { text: 'Home', icon: <Home />, path: '/welcome' },
        { text: 'Fee Portal', icon: <Payment />, path: '/fee-portal' },
        { text: 'Time Table', icon: <TableChart />, path: '/time-table' },
        { text: 'Attendance', icon: <CalendarToday />, path: '/attendance' },
        { text: 'Exam Dashboard', icon: <CloudUpload />, path: '/Exam-Dashboard' },
        { text: 'School Info', icon: <School />, path: '/school-info' },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: isCollapsed ? 60 : 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: isCollapsed ? 60 : 240,
                        boxSizing: 'border-box',
                        backgroundColor: '#333',
                        color: '#fff',
                        transition: 'width 0.3s ease',
                        zIndex: 900,
                        position: 'fixed',
                        height: '100vh',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 1,
                        backgroundColor: '#444',
                        borderBottom: '1px solid #555',
                    }}
                >
                    <IconButton
                        onClick={toggleSidebar}
                        sx={{
                            color: '#fff',
                            transition: 'transform 0.3s',
                            transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                        }}
                    >
                        {isCollapsed ? <Menu /> : <Close />}
                    </IconButton>
                </Box>

                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            component={NavLink}
                            to={item.path}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '5px 10px',
                                padding: 2,
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: 1,
                                transition: 'background-color 0.3s ease, transform 0.2s ease',
                                '&:hover': {
                                    backgroundColor: '#555',
                                    transform: 'scale(1.05)',
                                },
                                '&.active': {
                                    backgroundColor: '#444',
                                    color: '#fff',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: 'inherit',
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            {!isCollapsed && (
                                <ListItemText primary={item.text} sx={{ color: 'inherit' }} />
                            )}
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box
                sx={{
                    flexGrow: 1,
                    marginLeft: isCollapsed ? '60px' : '240px',
                    padding: 2,
                    transition: 'margin-left 0.3s ease',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Sidebar;
