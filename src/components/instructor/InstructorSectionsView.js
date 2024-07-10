import React, {useState, useEffect, useCallback} from 'react';
import { Link } from 'react-router-dom';
import {SERVER_URL} from '../../Constants';

const InstructorSectionsView = (props) => {
    const headers = ['SecNo', 'CourseId', 'SecId',  'Year', 'Semester', 'Building', 'Room', 'Times', '', ''];
    const displayHeaders = ['SecNo', 'CourseId', 'SecId', 'Building', 'Room', 'Times'];
    const [sections, setSections] = useState([]);
    const [search, setSearch] = useState({courseId:'', year:'', semester:''});
    const [message, setMessage] = useState('Manage assignments and grades.');

    const handleSearchChange = (event) => {
        setSearch({...search, [event.target.name]: event.target.value});
    }

    const fetchSections = useCallback(async () => {
        if (search.year==='' || search.semester==='') {
            setMessage("Enter search parameters");
        } else {
            try {
                const response = await fetch(`${SERVER_URL}/sections?email=dwisneski@csumb.edu&year=${search.year}&semester=${search.semester}`);
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
    }, [search.year, search.semester]); // useCallback ends here

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    return(
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1>Instructor Home</h1>
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
                <button onClick={fetchSections}>Show Sections</button>
            </div>
            <br/>
            <table className="Center" >
                <thead>
                <tr>
                    {displayHeaders.map((s, idx) => (<th key={idx}>{s}</th>))}
                </tr>
                </thead>
                <tbody>
                {sections.map((s) => (
                        <tr key={s.secNo}>
                        <td>{s.secNo}</td>
                        <td>{s.courseId}</td>
                        <td>{s.secId}</td>
                        <td>{s.building}</td>
                        <td>{s.room}</td>
                        <td>{s.times}</td>
                        <td><Link to="/enrollments" state={s}>Enrollments</Link></td>
                        <td><Link to="/assignments" state={s}>Assignments</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default InstructorSectionsView;
