import React, { useState } from 'react';
import './CourseFilter.css';
import tick from '../images/tick.png';
import cross from '../images/cross.png';
import empty from '../images/empty.png';

function CourseFilter() {
  const [assignmentsState, setAssignmentsState] = useState([
    { name: 'Exams', state: 0 }, // 0: unchecked, 1: checked, 2: intermediate
    { name: 'Group Work', state: 0 },
    { name: 'Presentations', state: 0 }
    
  ]);

  const toggleAssignmentState = (index) => {
    const newAssignmentsState = [...assignmentsState];
    newAssignmentsState[index].state = (newAssignmentsState[index].state + 1) % 3;
    setAssignmentsState(newAssignmentsState);
  };

  const [assignmentsOpen, setAssignmentsOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [semester1Checked, setSemester1Checked] = useState(false);
  const [semester2Checked, setSemester2Checked] = useState(false);

  const handleAvailabilityChange = (event) => {
    const { name, checked } = event.target;
    if (name === 'semester1') {
      setSemester1Checked(checked);
    } else if (name === 'semester2') {
      setSemester2Checked(checked);
    }
  };

  return (
    <div className='filter-main-div'>
      <div className='heading'>Course Electives Filter </div>
 
      {/* Assignments Subheading */}
      <div>
        <div className="sub-heading" onClick={() => setAssignmentsOpen(!assignmentsOpen)}>
          Have or dont have
          {/* <img src={subheadingIcon}></img> */}
        </div>
        {assignmentsOpen && (
          <div className='checkboxes-main-div'>
            
              {assignmentsState.map((assignment, index) => (
                <div  key={index} onClick={() => toggleAssignmentState(index)}>
                  <div className='checkbox-field-div'>
                  {assignment.state === 0 ? <img src={empty} className='checkbox-img' alt="unchecked" /> : (assignment.state === 1 ? <img src={tick} className='checkbox-img' alt="Checked" /> : <img src={cross} className='checkbox-img' alt="crossed" />)}
                  <div className='idk'>{assignment.name}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Availability Subheading */}
      <div>
        <div className="sub-heading" onClick={() => setAvailabilityOpen(!availabilityOpen)}>
          Available in
        </div>
        {availabilityOpen && (
          <div className='checkboxes-main-div'>
            <label>
              <input
                type="checkbox"
                name="semester1"
                checked={semester1Checked}
                onChange={handleAvailabilityChange}
              />
              Semester 1
            </label>
            <label>
              <input
                type="checkbox"
                name="semester2"
                checked={semester2Checked}
                onChange={handleAvailabilityChange}
              />
              Semester 2
            </label>
          </div>
        )}
      </div> 

      {/* Send Button */}
      <button>Send</button>
    </div>
  );
}

export default CourseFilter;
