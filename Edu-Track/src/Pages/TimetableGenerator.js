import 'jspdf-autotable';
import { useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import { jsPDF } from 'jspdf';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const classes = ['Nursery', 'LKG', 'UKG', 'CLASS-1', 'CLASS-2', 'CLASS-3', 'CLASS-4', 'CLASS-5', 'CLASS-6', 'CLASS-7', 'CLASS-8', 'CLASS-9', 'CLASS-10'];

const TimetableGenerator = () => {
    const [formData, setFormData] = useState({
        day: '',
        subject: '',
        startTime: '',
        endTime: '',
        classStandard: '',
    });

    const [studentClass, setStudentClass] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [timetable, setTimetable] = useState([]);
    const [lunchBreak, setLunchBreak] = useState({ startTime: '', endTime: '', applyToAllDays: true, customDays: [] });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleStudentClassChange = (e) => {
        setStudentClass(e.target.value);
    };

    const handleLunchChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === 'applyToAllDays') {
            setLunchBreak({ ...lunchBreak, [name]: checked });
        } else if (name === 'customDays') {
            const customDays = checked 
                ? [...lunchBreak.customDays, value] 
                : lunchBreak.customDays.filter(day => day !== value);
            setLunchBreak({ ...lunchBreak, customDays });
        } else {
            setLunchBreak({ ...lunchBreak, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const timeSlot = `${formData.startTime} - ${formData.endTime}`;
        if (!timeSlots.includes(timeSlot)) {
            setTimeSlots([...timeSlots, timeSlot]);
        }
        setTimetable([...timetable, { ...formData, studentClass }]);
        setFormData({ day: '', subject: '', startTime: '', endTime: '', classStandard: '' });
    };

    const handleLunchSubmit = (e) => {
        e.preventDefault();
        const lunchTimeSlot = `${lunchBreak.startTime} - ${lunchBreak.endTime}`;
        if (!timeSlots.includes(lunchTimeSlot)) {
            setTimeSlots([...timeSlots, lunchTimeSlot]);
        }
    };

    const handleDelete = (day, slot) => {
        const newTimetable = timetable.filter(entry => !(entry.day === day && `${entry.startTime} - ${entry.endTime}` === slot));
        setTimetable(newTimetable);
    };

    const handleDeleteTimeSlot = (slot) => {
        const newTimeSlots = timeSlots.filter(timeSlot => timeSlot !== slot);
        setTimeSlots(newTimeSlots);
        const newTimetable = timetable.filter(entry => `${entry.startTime} - ${entry.endTime}` !== slot);
        setTimetable(newTimetable);
    };

    const generatePDF = () => {
        const doc = new jsPDF('landscape'); // Set orientation to landscape
    
        const tableColumn = ['Day', ...timeSlots];
        const tableRows = [];
    
        daysOfWeek.forEach(day => {
            const row = [day];
            timeSlots.forEach(slot => {
                const entry = timetable.find(entry => entry.day === day && `${entry.startTime} - ${entry.endTime}` === slot);
                const isLunchBreak = lunchBreak.applyToAllDays
                    ? `${lunchBreak.startTime} - ${lunchBreak.endTime}` === slot
                    : lunchBreak.customDays.includes(day) && `${lunchBreak.startTime} - ${lunchBreak.endTime}` === slot;
                row.push(entry ? entry.subject : isLunchBreak ? 'Lunch Break' : '');
            });
            tableRows.push(row);
        });
    
        doc.text(`Class: ${studentClass}`, 14, 16);
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid', // Optional: Add table styling
            styles: {
                fontSize: 25, // Change this value to adjust the font size
            },
            headStyles: {
                fontSize: 28, // Change this value to adjust the header font size
            },
            bodyStyles: {
                fontSize: 25, // Change this value to adjust the body font size
            },
        });
    
        doc.save('timetable.pdf');
    };
    

    return (
        <Box p={4} display="flex" flexDirection="column" gap={1} alignItems="center">
            <FormControl fullWidth>
                <InputLabel>Student Class</InputLabel>
                <Select
                    value={studentClass}
                    onChange={handleStudentClassChange}
                    required
                >
                    <MenuItem value="">Select Class</MenuItem>
                    {classes.map((cls) => (
                        <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                        <h3>Add Class</h3>
                        <FormControl fullWidth>
                            <InputLabel>Day</InputLabel>
                            <Select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">Select Day</MenuItem>
                                {daysOfWeek.map((day) => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            label="Start Time"
                            name="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="End Time"
                            name="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Add Class
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box component="form" onSubmit={handleLunchSubmit} display="flex" flexDirection="column" gap={2}>
                        <h3>Add Lunch Break</h3>
                        <TextField
                            label="Start Time"
                            name="startTime"
                            type="time"
                            value={lunchBreak.startTime}
                            onChange={handleLunchChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="End Time"
                            name="endTime"
                            type="time"
                            value={lunchBreak.endTime}
                            onChange={handleLunchChange}
                            required
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="applyToAllDays"
                                    checked={lunchBreak.applyToAllDays}
                                    onChange={handleLunchChange}
                                />
                            }
                            label="Apply to All Days"
                        />
                        {!lunchBreak.applyToAllDays && (
                            <FormGroup>
                                {daysOfWeek.map((day) => (
                                    <FormControlLabel
                                        key={day}
                                        control={
                                            <Checkbox
                                                name="customDays"
                                                value={day}
                                                checked={lunchBreak.customDays.includes(day)}
                                                onChange={handleLunchChange}
                                                />
                                            }
                                            label={day}
                                        />
                                    ))}
                                </FormGroup>
                            )}
                            <Button type="submit" variant="contained" color="secondary">
                                Add Lunch Break
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Day</TableCell>
                                {timeSlots.map((slot) => (
                                    <TableCell key={slot}>
                                        {slot}
                                        <Button 
                                            size="small" 
                                            color="error" 
                                            onClick={() => handleDeleteTimeSlot(slot)}
                                        >
                                            X
                                        </Button>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {daysOfWeek.map((day) => (
                                <TableRow key={day}>
                                    <TableCell>{day}</TableCell>
                                    {timeSlots.map((slot) => {
                                        const entry = timetable.find((entry) => entry.day === day && `${entry.startTime} - ${entry.endTime}` === slot);
                                        const isLunchBreak = lunchBreak.applyToAllDays
                                            ? `${lunchBreak.startTime} - ${lunchBreak.endTime}` === slot
                                            : lunchBreak.customDays.includes(day) && `${lunchBreak.startTime} - ${lunchBreak.endTime}` === slot;
                                        return (
                                            <TableCell key={slot}>
                                                {entry ? (
                                                    <Box display="flex" justifyContent="space-between">
                                                        <span>{entry.subject}</span>
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(day, slot)}
                                                        >
                                                            X
                                                        </Button>
                                                    </Box>
                                                ) : isLunchBreak ? 'Lunch Break' : ''}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Button
                    variant="contained"
                    color="success"
                    onClick={generatePDF}
                    disabled={!timetable.length}
                >
                    Generate PDF
                </Button>
                </Box>
            
    );
};

export default TimetableGenerator;
