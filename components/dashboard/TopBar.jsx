import React, { useState } from 'react';
import { UploadButton } from './UploadButton';

const TopBar = ({ onSort }) => {
  const [sortBy, setSortBy] = useState('date');

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value);
  };

  return (
    <div className="h-16 bg-white flex align-middle justify-start items-center gap-6 px-4">
      <h1 className="text-xl font-medium">Aceitei</h1>
      <UploadButton text="Upload"/>
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Ordenar por:</span>
        <select 
          value={sortBy}
          onChange={handleSortChange}
          className="border rounded px-2 py-1"
        >
          <option value="date">Data</option>
          <option value="title">Título</option>
        </select>
      </div>
    </div>
  );
};

export default TopBar;
