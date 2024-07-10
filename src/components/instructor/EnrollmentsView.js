import React, {useState, useEffect, useCallback} from 'react';
import {useLocation} from 'react-router-dom';
import {SERVER_URL} from '../../Constants';

// instructor view list of students enrolled in a section
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {
    const headers = ['Enrollment Id', 'Student Id', 'Name', 'Email', 'Grade'];
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('Manage enrollments and grades.');
    const [search, setSearch] = useState({year:'', semester:''});
    const location = useLocation();
    const {secNo, courseId, secId} = location.state;

    const handleSearchChange = (event) => {
        setSearch({...search, [event.target.name]: event.target.value});
    }

    const onGradeChange = async () => {
        for (const e of enrollments) {
            try {
                const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments/${e.enrollmentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ grade: e.grade }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Refresh the enrollments
        fetchEnrollments();
    };


const fetchEnrollments = useCallback(async () => {
    try {
        const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`);
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
}, [secNo]); // useCallback ends here


    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <br/>
            <h3>{courseId}-{secId} Enrollments</h3>
            <table className="Center" >
                <thead>
                <tr>
                    {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {enrollments.map((e) => (
                        <tr key={e.enrollmentId}>
                        <td>{e.enrollmentId}</td>
                        <td>{e.studentId}</td>
                        <td>{e.name}</td>
                        <td>{e.email}</td>
                        <td><input type="text" name="grade" value={e.grade} onChange={(event) => onGradeChange(event, e.enrollmentId)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p style={{color: 'blue', cursor: 'pointer'}} onClick={onGradeChange}>Save Grades</p>
        </div>
    );
}

export default EnrollmentsView;
