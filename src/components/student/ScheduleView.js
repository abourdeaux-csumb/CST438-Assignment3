import React, {useState, useEffect} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = (props) => {
      const headers = ['Year', 'Semester', 'CourseId', 'Title', 'SecNo', 'Building', 'Room', 'Times', 'Credits', ''];

      const [enrollments, setEnrollments] = useState([]);

      const [search, setSearch] = useState({year:'', semester:''});

      const [message, setMessage] = useState('');

      const fetchEnrollments = async () => {
          if (search.year==='' || search.semester==='') {
              setMessage("Enter search parameters");
          } else {
            try {
              const response = await fetch(`${SERVER_URL}/enrollments?studentId=3&year=${search.year}&semester=${search.semester}`);
              if (response.ok) {
                const data = await response.json();
                setEnrollments(data);
              } else {
                const rc = await response.json();
                setMessage(rc.message);
              }
            } catch(err) {
              setMessage("network error: "+err);
            }
          }
      }

     useEffect( () => {
       fetchEnrollments();
     },  []);

    const deleteEnrollment = async (enrollmentId) => {
      try {
        const response = await fetch (`${SERVER_URL}/enrollments/${enrollmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setMessage("Enrollment dropped");
          fetchEnrollments();
        } else {
          const rc = await response.json();
          setMessage(rc.message);
        }
      } catch (err) {
        setMessage("network error: "+err);
      }
    }

    const editChange = (event) => {
        setSearch({...search,  [event.target.name]:event.target.value});
    }

    const onDelete = (e) => {
      const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
      const enrollmentId = enrollments[row_idx].enrollmentId;
      confirmAlert({
          title: 'Confirm to drop course',
          message: 'Do you really want to drop this course?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => deleteEnrollment(enrollmentId)
            },
            {
              label: 'No',
            }
          ]
        });
    }

     return(
         <div>
             <h3>Schedule</h3>

             <h4>{message}</h4>
             <h4>Enter year and semester.  Example 2024 Spring</h4>
             <table className="Center">
                 <tbody>
                 <tr>
                     <td>Year:</td>
                     <td><input type="text" id="syear" name="year" value={search.year} onChange={editChange} /></td>
                 </tr>
                 <tr>
                     <td>Semester:</td>
                     <td><input type="text" id="ssemester" name="semester" value={search.semester} onChange={editChange} /></td>
                 </tr>
                 </tbody>
             </table>
             <br/>
             <button type="submit" id="search" onClick={fetchEnrollments} >Search for Enrollments</button>
             <table className="Center" >
                 <thead>
                 <tr>
                     {headers.map((e, idx) => (<th key={idx}>{e}</th>))}
                 </tr>
                 </thead>
                 <tbody>
                 {enrollments.map((e) => (
                         <tr key={e.enrollmentId}>
                         <td>{e.year}</td>
                         <td>{e.semester}</td>
                         <td>{e.courseId}</td>
                         <td>{e.title}</td>
                         <td>{e.sectionNo}</td>
                         <td>{e.building}</td>
                         <td>{e.room}</td>
                         <td>{e.times}</td>
                         <td>{e.credits}</td>
                         <td><Button onClick={onDelete}>DROP</Button></td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
     )

}

export default ScheduleView;