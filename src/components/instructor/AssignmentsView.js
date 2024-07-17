import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';

const AssignmentsView = (props) => {

    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const {secNo, courseId, secId} = location.state;


    const fetchAssignments = async () => {
       
      try {
        const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
        if (response.ok) {
          const data = await response.json();
          setAssignments(data);
        } else {
          const rc = await response.json();
          setMessage("fetch error "+rc.message);
        }
      } catch (err) {
        setMessage("network error "+err);
      }
    }

    useEffect(() => {
      fetchAssignments()
    }, []);

    const add = (assignment) => {
        assignment.courseId = courseId;
        assignment.secId = secId;
        assignment.secNo = secNo;
        fetch (`${SERVER_URL}/assignments`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify(assignment),
        })
        .then(response => response.json() )
        .then(data => {
            setMessage("Assignment created id="+data.id);
            fetchAssignments();
        })
        .catch(err => setMessage(err));
    }

    const save = (assignment) => {
        fetch (`${SERVER_URL}/assignments`, 
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify(assignment),
        })
        .then(response => response.json() )
        .then(data => {
            setMessage("Assignment saved");
            fetchAssignments();
        })
        .catch(err => setMessage(err));
    }


    const doDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const id = assignments[row_idx].id;
        fetch (`${SERVER_URL}/assignments/${id}`, 
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }, 
        })
        .then(response => {
            if (response.ok) {
                setMessage("Assignment deleted");
                fetchAssignments();
            } else {
                setMessage("Delete failed");
            }
            
        })
        .catch(err => setMessage(err));
    }

    const onDelete = (e) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => doDelete(e)
              },
              {
                label: 'No',
              }
            ]
          });
    }

    const headers = ['id', 'Title', 'Due Date', '', '', ''];
     
    return(
        <div> 
            <h3>{message}</h3>   

            { assignments.length > 0 && 
                <> 
                    <h3>{courseId}-{secId} Assignments</h3>   
                    
                    <table className="Center" > 
                        <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {assignments.map((a) => (
                                <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.title}</td>
                                <td>{a.dueDate}</td>
                                <td><AssignmentGrade assignment={a} /></td>
                                <td><AssignmentUpdate assignment={a} save={save} /></td>
                                <td><Button onClick={onDelete}>Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }

            <AssignmentAdd save={add} />
        </div>
    );
}

export default AssignmentsView;
