import { useState } from 'react';

const filterList = ['All', "Completed", "Pending"];

export default function ProjectFilter({ changeFilter }) {
  const [currentFilter, setCurrentFilter] = useState('All');

  const handleClick = (newFilter) => {
    setCurrentFilter(newFilter);
    changeFilter(newFilter);
  }; 

  return (
    <div className="project-filter">
      <h6>Filter by:</h6>

        {filterList.map((f) => (
          <button
            key={f}
            onClick={() => handleClick(f)}
            
          >
            {f}
          </button>
        ))}
    </div>
  );
}
