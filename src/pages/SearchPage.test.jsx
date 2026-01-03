import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './SearchPage';
import HomePage from './HomePage';

// Mock react-dnd to avoid ESM issues in Jest
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => <div>{children}</div>,
  useDrag: () => [{ isDragging: false }, () => {}],
  useDrop: () => [{}, () => {}],
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {},
}));

test('renders SearchPage without crashing', () => {
  render(
    <MemoryRouter initialEntries={['/search?location=London']}>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Homes for sale/i)).toBeInTheDocument();
});

test('HomePage search navigation', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Where do you want to live/i);
    fireEvent.change(input, { target: { value: 'London' } });
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form);

    expect(screen.getByText(/Homes for sale/i)).toBeInTheDocument();
});

test('filters properties by location input', () => {
  render(
    <MemoryRouter initialEntries={['/search']}>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </MemoryRouter>
  );

  const locationInput = screen.getByPlaceholderText('City, Postcode');
  
  // Filter for 'Camden'
  fireEvent.change(locationInput, { target: { value: 'Camden' } });
  
  // Should find the Camden property
  expect(screen.getByText(/Camden High Street/i)).toBeInTheDocument();
  
  // Should NOT find the Chelsea property
  expect(screen.queryByText(/King's Road/i)).not.toBeInTheDocument();
});
