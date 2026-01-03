import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyPage from './pages/PropertyPage';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/property/:id" element={<PropertyPage />} />
          </Routes>
        </div>
      </Router>
    </DndProvider>
  );
}

export default App;