import React from 'react';

const GridContainer: React.FC = () => {
  return (
    <div className="bg-[#24283B] min-h-screen p-4 text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Saved Tracks</h1>
        <select className="bg-transparent border border-white rounded px-2 py-1">
          <option>Sort by save date</option>
          <option>Sort by name</option>
        </select>
      </header>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
          {[...Array(100)].map((_, index) => (
            <div key={index} className="aspect-square bg-gray-700 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GridContainer;