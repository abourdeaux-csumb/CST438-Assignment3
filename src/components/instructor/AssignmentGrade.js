import React, { useState, useEffect } from 'react';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField } from '@mui/material';
import { SERVER_URL } from '../../Constants';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />


const AssignmentGrade = ({ assignmentId, onClose }) => {
    const [grades, setGrades] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${assignmentId}/grades`);
            if (response.ok) {
                const data = await response.json();
                setGrades(data);
            } else {
                const json = await response.json();
                setMessage("Response error: " + json.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    const handleChange = (e, index) => {
        const newGrades = [...grades];
        newGrades[index].score = e.target.value ? parseInt(e.target.value, 10) : null;
        setGrades(newGrades);
    };

    const saveGrades = async () => {
        try {
            console.log("Sending grades to save:", grades);
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grades),
            });
            if (response.ok) {
                setMessage("Grades saved successfully");
                fetchGrades();
            } else {
                const json = await response.json();
                setMessage("Response error: " + json.message);
            }
        } catch (err) {
            setMessage("Network error: " + err);
        }
    };

    return (
        <Paper>
            <h3>Assignment Grades</h3>
            <h4>{message}</h4>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Grade ID</TableCell>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Student Email</TableCell>
                        <TableCell>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {grades.map((g, index) => (
                        <TableRow key={g.gradeId}>
                            <TableCell>{g.gradeId}</TableCell>
                            <TableCell>{g.studentName}</TableCell>
                            <TableCell>{g.studentEmail}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    name="score"
                                    value={g.score !== null ? g.score : ''}
                                    onChange={(e) => handleChange(e, index)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button variant="contained" color="primary" onClick={saveGrades}>Save Grades</Button>
            <Button variant="contained" color="secondary" onClick={onClose}>Close</Button>
        </Paper>
    );
};

export default AssignmentGrade;