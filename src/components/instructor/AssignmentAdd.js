import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { SERVER_URL } from '../../Constants';
// complete the code.
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = ({ secNo, save }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setDueDate('');
        setMessage('');
    };

    const saveAssignment = async () => {
        const assignment = { title, dueDate, secNo: secNo };
        console.log("Attempting to save assignment:", assignment);
        try {
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assignment),
            });
            if (response.ok) {
                setMessage('Assignment added successfully');
                save();
                handleClose();
            } else {
                const json = await response.json();
                setMessage("Response error: " + json.message);
                console.error("Response error:", json);
            }
        } catch (err) {
            setMessage('Network error: ' + err);
            console.error("Network error:", err);
        }
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>Add Assignment</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Assignment</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" id="title" label="Title" type="text" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                    <TextField margin="dense" id="dueDate" label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    {message && <p>{message}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={saveAssignment} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AssignmentAdd;