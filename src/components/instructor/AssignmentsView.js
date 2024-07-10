import React, { useState, useEffect } from 'react';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { SERVER_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentGrade from './AssignmentGrade';
// instructor views assignments for their section
// use location to get the section value
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment


const AssignmentsView = () => {
    const [sections, setSections] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [gradingAssignment, setGradingAssignment] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openGradeDialog, setOpenGradeDialog] = useState(false); // New state for grading dialog

    const instructors = [
        { email: 'dwisneski@csumb.edu', sections: [8, 9] },
        { email: 'jgross@csumb.edu', sections: [8, 9] }
    ];

    const fetchAssignments = async (secNo) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                const json = await response.json();
                setMessage("Response error: " + json.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInstructorChange = (event) => {
        const email = event.target.value;
        setSelectedInstructor(email);
        const instructor = instructors.find((instr) => instr.email === email);
        if (instructor) {
            setSections(instructor.sections);
        }
    };

    const handleSectionChange = (event) => {
        const secNo = event.target.value;
        setSelectedSection(secNo);
        fetchAssignments(secNo);
    };

    const deleteAssignment = async (assignmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                setMessage("Assignment deleted successfully");
                fetchAssignments(selectedSection);
            } else {
                const json = await response.json();
                setMessage("Delete failed: " + json.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    const handleEditClick = (assignment) => {
        setSelectedAssignment(assignment);
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
        setSelectedAssignment(null);
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectedAssignment),
            });
            if (response.ok) {
                setMessage("Assignment updated successfully");
                fetchAssignments(selectedSection);
                handleEditClose();
            } else {
                const json = await response.json();
                setMessage("Update failed: " + json.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setSelectedAssignment({ ...selectedAssignment, [name]: value });
    };

    const handleGradeClick = (assignment) => {
        setGradingAssignment(assignment);
        setOpenGradeDialog(true); // Open grading dialog
    };

    const handleGradeClose = () => {
        setOpenGradeDialog(false); // Close grading dialog
        setGradingAssignment(null);
    };

    return (
        <Paper>
            <h3>Assignments</h3>
            <h4>{message}</h4>
            <FormControl fullWidth style={{ marginBottom: '10px' }}>
                <InputLabel>Select Instructor</InputLabel>
                <Select value={selectedInstructor} onChange={handleInstructorChange}>
                    {instructors.map((instructor) => (
                        <MenuItem key={instructor.email} value={instructor.email}>
                            {instructor.email}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {selectedInstructor && (
                <FormControl fullWidth style={{ marginBottom: '10px' }}>
                    <InputLabel>Select Section</InputLabel>
                    <Select value={selectedSection} onChange={handleSectionChange}>
                        {sections.map((section) => (
                            <MenuItem key={section} value={section}>
                                {section}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Assignment ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {assignments.map((assignment) => (
                            <TableRow key={assignment.id}>
                                <TableCell>{assignment.id}</TableCell>
                                <TableCell>{assignment.title}</TableCell>
                                <TableCell>{assignment.dueDate}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleGradeClick(assignment)}>Grade</Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleEditClick(assignment)}>Edit</Button>
                                    <Button variant="contained" color="error" onClick={() => deleteAssignment(assignment.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            {selectedSection && <AssignmentAdd secNo={selectedSection} save={() => fetchAssignments(selectedSection)} />}

            <Dialog open={openEditDialog} onClose={handleEditClose} maxWidth="md" fullWidth>
                <DialogTitle>Edit Assignment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={selectedAssignment?.title || ''}
                        onChange={handleEditChange}
                    />
                    <TextField
                        margin="dense"
                        id="dueDate"
                        name="dueDate"
                        label="Due Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={selectedAssignment?.dueDate || ''}
                        onChange={handleEditChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="primary">Cancel</Button>
                    <Button onClick={handleEditSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openGradeDialog} onClose={handleGradeClose} maxWidth="md" fullWidth>
                <DialogTitle>Grade Assignment</DialogTitle>
                <DialogContent>
                    <AssignmentGrade assignmentId={gradingAssignment?.id} onClose={handleGradeClose} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleGradeClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default AssignmentsView;