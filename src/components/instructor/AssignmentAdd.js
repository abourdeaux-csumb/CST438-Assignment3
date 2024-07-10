

import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { handleSave } from './AssignmentUpdate'; // Import handleSave function

// complete the code.
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [message, setMessage] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTitle('');
        setDueDate('');
        setMessage('');
    };

    const saveAssignment = async () => {
        const assignment = { title, dueDate };
        try {
            const result = await handleSave(assignment, 'POST');
            if (result.success) {
                setMessage('Assignment added successfully');
                props.save(assignment);
                handleClose();
            } else {
                setMessage(result.message);
            }
        } catch (err) {
            setMessage('Network error: ' + err);
        }
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Add Assignment
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Assignment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="dueDate"
                        label="Due Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    {message && <p>{message}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={saveAssignment} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AssignmentAdd;