import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { SERVER_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';

// instructor views assignments for their section
// use location to get the section value
//
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = () => {
    const location = useLocation();
    const secNo = new URLSearchParams(location.search).get('secNo');
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
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
        }
    };

    const deleteAssignment = async (assignmentId) => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setMessage("Assignment deleted successfully");
                fetchAssignments();
            } else {
                const json = await response.json();
                setMessage("Delete failed: " + json.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    return (
        <Paper>
            <h3>Assignments for Section {secNo}</h3>
            <h4>{message}</h4>
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
                        <TableRow key={assignment.assignmentId}>
                            <TableCell>{assignment.assignmentId}</TableCell>
                            <TableCell>{assignment.title}</TableCell>
                            <TableCell>{assignment.dueDate}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => {/* navigate to grade page */}}>
                                    Grade
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => {/* navigate to edit page */}}>
                                    Edit
                                </Button>
                                <Button variant="contained" color="error" onClick={() => deleteAssignment(assignment.assignmentId)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <AssignmentAdd save={() => fetchAssignments()} />
        </Paper>
    );
};

export default AssignmentsView;