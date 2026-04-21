import React, { useState } from 'react';

const TableSelector = ({ onStart }) => {
  const [selectedTables, setSelectedTables] = useState([]);

  const getDifficultyIcon = (num) => {
    const animals = {
      1: '🐭',
      2: '🐱',
      3: '🐶',
      4: '🐰',
      5: '🦊',
      6: '🐻',
      7: '🐼',
      8: '🦁',
      9: '🐯',
      10: '🐉'
    };
    return animals[num];
  };

  const toggleTable = (table) => {
    if (selectedTables.includes(table)) {
      setSelectedTables(selectedTables.filter(t => t !== table));
    } else {
      setSelectedTables([...selectedTables, table]);
    }
  };

  const handleStart = () => {
    if (selectedTables.length > 0) {
      onStart(selectedTables.sort((a, b) => a - b));
    }
  };

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="table-selector">
      <div className="selector-container">
        <h1>🧮 Tablas de Multiplicar</h1>
        <p className="subtitle">Elige las tablas que quieres practicar</p>

        <div className="tables-grid">
          {numbers.map(num => (
            <button
              key={num}
              className={`table-button ${selectedTables.includes(num) ? 'selected' : ''}`}
              onClick={() => toggleTable(num)}
              title={`Tabla del ${num}`}
            >
              <span className="number-display">{num}</span>
              <span className="difficulty-icon">{getDifficultyIcon(num)}</span>
            </button>
          ))}
        </div>

        <div className="selection-info">
          {selectedTables.length === 0 ? (
            <p>Selecciona al menos una tabla para comenzar</p>
          ) : (
            <p>Has seleccionado {selectedTables.length} tabla{selectedTables.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        <button
          className={`start-button ${selectedTables.length === 0 ? 'disabled' : ''}`}
          onClick={handleStart}
          disabled={selectedTables.length === 0}
        >
          🚀 Comenzar
        </button>
      </div>
    </div>
  );
};

export default TableSelector;
