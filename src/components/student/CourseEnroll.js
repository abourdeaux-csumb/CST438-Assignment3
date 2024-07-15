import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';
import { confirmAlert } from 'react-confirm-alert'; // Import
// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {

     const headers = ['SecNo', 'CourseId', 'SecId',  'Year', 'Semester', 'Building', 'Room', 'Times', ''];

     const [sections, setSections] = useState([]);

     const [message, setMessage] = useState('');

     const fetchOpenSections = async () => {
       try {
         const response = await fetch(`${SERVER_URL}/sections/open`);
         if (response.ok) {
           const data = await response.json();
           setSections(data);
         } else {
           const rc = await response.json();
           setMessage(rc.message);
         }
       } catch(err) {
         setMessage("network error: "+err);
       }
     }

    useEffect( () => {
      fetchOpenSections();
    },  []);

     const enroll = async (secNo) => {
       try {
         const response = await fetch (`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`,
         {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Access-Control-Allow-Origin': '*'
           },
         });
         if (response.ok) {
           setMessage("Enrolled in course");
           fetchOpenSections();
         } else {
           const rc = await response.json();
           setMessage(rc.message);
         }
       } catch (err) {
         setMessage("network error: "+err);
       }
     }


     const onEnroll = (e) => {
       const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
       const secNo = sections[row_idx].secNo;
       confirmAlert({
           title: 'Confirm enrollment',
           message: 'Do you want to enroll in this course?',
           buttons: [
             {
               label: 'Yes',
               onClick: () => enroll(secNo)
             },
             {
               label: 'No',
             }
           ]
         });
     }
 
    return(
        <div>
            <h3>Enroll in Courses</h3>

            <h4 id="message">{message}</h4>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                        <tr key={s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.year}</td>
                        <td>{s.semester}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Button onClick={onEnroll}>Enroll</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CourseEnroll;
