import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import {SERVER_URL} from "../../Constants";
import AssignmentAdd from "./AssignmentAdd";

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const [assignments, setAssignments] = useState([]);
const [message, setMessage] = useState('');

useEffect(() => {
    fetchAssignments();
}, []);

const fetchAssignments = async () => {
    try {
        const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
        if (response.ok) {
            const assignments = await response.json();
            setAssignments(assignments);
        } else {
            const json = await response.json();
            setMessage("response error: " + json.message);
        }
    } catch (err) {
        setMessage("network error: " + err);
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
        setMessage("network error: " + err);
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
export default AssignmentsView;