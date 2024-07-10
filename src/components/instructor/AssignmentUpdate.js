import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { SERVER_URL } from '../../Constants';

//  instructor updates assignment title, dueDate
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

export const handleSave = async (assignment, method) => {
    const url = `${SERVER_URL}/assignments`;
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(assignment),
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, message: errorData.message };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const AssignmentUpdate = (props) => {
    const { assignment, save } = props;
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(assignment.title);
    const [dueDate, setDueDate] = useState(assignment.dueDate);
    const [sectionNo, setSectionNo] = useState(assignment.sectionNo);
    const [message, setMessage] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMessage('');
    };

    const handleUpdateSave = async () => {
        const updatedAssignment = { ...assignment, title, dueDate, sectionNo };
        const result = await handleSave(updatedAssignment, 'PUT');
        if (result.success) {
            setMessage('Assignment updated successfully');
            save(updatedAssignment);
            handleClose();
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div>
            <Button variant="outlined" color="secondary" onClick={handleClickOpen}>Edit</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Assignment</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" id="sectionNo" label="Section No" type="text" fullWidth value={sectionNo} onChange={(e) => setSectionNo(e.target.value)} />
                    <TextField autoFocus margin="dense" id="title" label="Title" type="text" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
                    <TextField margin="dense" id="dueDate" label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    {message && <p>{message}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleUpdateSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AssignmentUpdate;