import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../../Constants';

const StudentAssignmentsView = (props) => {
    const [assignments, setAssignments] = useState([]);
    const [search, setSearch] = useState({year:'', semester:''});
    const [message, setMessage] = useState('');

    const fetchAssignments = useCallback(async () => {
        if (search.year==='' || search.semester==='') {
            setMessage("Enter search parameters");
        } else {
            try {
                const response = await fetch(`${SERVER_URL}/assignments?studentId=3&year=${search.year}&semester=${search.semester}`);
                if (response.ok) {
                    const data = await response.json();
                    setAssignments(data);
                } else {
                    const rc = await response.json();
                    setMessage(rc.message);
                }
            } catch(err) {
                setMessage("network error: " +err);
            }
        }
    }, [search.year, search.semester]);

    const handleSearchChange = (event) => {
        setSearch({...search, [event.target.name]: event.target.value});
    }

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h3>Assignments</h3>
            <h4>{message}</h4>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '250px', marginBottom: '10px'}}>
                    <label>Year:</label>
                    <input type="text" name="year" onChange={handleSearchChange}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '250px', marginBottom: '10px'}}>
                    <label>Semester:</label>
                    <input type="text" name="semester" onChange={handleSearchChange}/>
                </div>
                <br/>
            </div>
            <br/>
            <table className="Center">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Title</th>
                        <th>DueDate</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) => (
                        <tr key={assignment.id}>
                            <td>{assignment.courseId}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.dueDate}</td>
                            <td>{assignment.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentAssignmentsView;
