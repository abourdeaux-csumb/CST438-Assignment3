import React, { useState, useEffect, useCallback } from 'react';
import { SERVER_URL } from '../../Constants';
import { Link } from 'react-router-dom';

const InstructorSectionsView = () => {
    const [term, setTerm] = useState({ year: '', semester: '' });
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('Manage assignments and grades.');

    const onChange = (event) => {
        setTerm({ ...term, [event.target.name]: event.target.value });
    }

    const fetchSections = useCallback(async () => {
        if (term.year === '' || term.semester === '') {
            setMessage("");
        } else {
            try {
                const response = await fetch(`${SERVER_URL}/sections?year=${term.year}&semester=${term.semester}&email=dwisneski@csumb.edu`);

                if (response.ok) {
                    const data = await response.json();
                    setSections(data);
                } else {
                    const rc = await response.json();
                    setMessage(rc.message);
                }
            } catch (err) {
                setMessage("network error: " + err);
            }
        }
	}, [term.year, term.semester]); // dependencies


	useEffect(() => {
		fetchSections();
	}, [fetchSections]);

    return (
        <>
            <table id="sectionTable" className="Center">
                <tbody>
                    <tr>
                        <td>Year:</td>
                        <td><input type="text" id="year" name="year" value={term.year} onChange={onChange} /></td>
                    </tr>
                    <tr>
                        <td>Semester:</td>
                        <td><input type="text" id="semester" name="semester" value={term.semester} onChange={onChange} /></td>
                    </tr>
                </tbody>
            </table>
            <Link to='/sections' state={term}>Show Sections</Link>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                    <tr>
                        <th>SecNo</th>
                        <th>CourseId</th>
                        <th>SecId</th>
                        <th>Building</th>
                        <th>Room</th>
                        <th>Times</th>
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
                            <td><Link id="enrollments" to="/enrollments" state={s}>Enrollments</Link></td>
                            <td><Link id="assignments" to="/assignments" state={s}>Assignments</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default InstructorSectionsView;
