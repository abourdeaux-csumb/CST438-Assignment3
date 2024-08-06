import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';

// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {
  const headers = ['Year', 'Semester', 'CourseId',  'SectionId', 'Title', 'Credits', 'Grade'];

  const [transcripts, setTranscripts] = useState([]);
  const [message, setMessage] = useState('');

  const fetchTranscripts = async () => {
    try {
      const jwt = sessionStorage.getItem('jwt');
      const response = await fetch(`${SERVER_URL}/transcripts`, {
        headers: {
          'Authorization': jwt
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTranscripts(data);
      } else {
        const rc = await response.json();
        setMessage(rc.message);
      }
    } catch(err) {
      setMessage("network error: " + err);
    }
  }

 useEffect( () => {
   fetchTranscripts();
 },  []);

 return(
     <div>
         <h3>Transcripts</h3>

         <h4>{message}</h4>
         <table className="Center" >
             <thead>
             <tr>
                 {headers.map((t, idx) => (<th key={idx}>{t}</th>))}
             </tr>
             </thead>
             <tbody>
             {transcripts.map((t) => (
                     <tr key={t.enrollmentId}>
                     <td>{t.year}</td>
                     <td>{t.semester}</td>
                     <td>{t.courseId}</td>
                     <td>{t.sectionId}</td>
                     <td>{t.title}</td>
                     <td>{t.credits}</td>
                     <td>{t.grade}</td>
                     </tr>
                 ))}
             </tbody>
         </table>
     </div>
 );
}

export default Transcript;
