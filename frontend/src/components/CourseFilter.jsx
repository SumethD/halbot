import React, { useState } from 'react';
import './CourseFilter.css';
import tick from '../images/tick.png';
import cross from '../images/cross.png';
import empty from '../images/empty.png';
import sectionIcon from '../images/fi-rr-angle-down.svg';

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

  const [filterOpen, setFilterOpen] = useState(true);
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
      <div className='flex-heading' onClick={() => setFilterOpen(!filterOpen)}>
        <div className='filter-heading'>Course Electives Filter </div>
        <div className={`icon-container ${filterOpen ? 'rotate-icon rotate-icon-opened' : 'rotate-icon'}`}>
          <img src={sectionIcon} alt="Section Icon" />
        </div>
      </div>
      {filterOpen && (
        <div>
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
          
        <div className='checkboxes-main-div'>
            <div  onClick={() => setSemester1Checked(!semester1Checked)}>
                <div className='checkbox-field-div'>
                    {semester1Checked ? <img src={tick} className='checkbox-img' alt="Checked" /> : <img src={empty} className='checkbox-img' alt="unchecked" />}
                    <div className='idk'>Semester 1</div>
                </div>
            </div>
            <div  onClick={() => setSemester2Checked(!semester2Checked)}>
                <div className='checkbox-field-div'>
                    {semester2Checked ? <img src={tick} className='checkbox-img' alt="Checked" /> : <img src={empty} className='checkbox-img' alt="unchecked" />}
                    <div className='idk'>Semester 2</div>
                </div>
            </div>
        </div>

        
        {/* Send Button */}
        <div className='flexy-end'><button className='send-filter-btn'>Send</button></div>
        </div>
      )}
    </div>
  );
}

export default CourseFilter;
