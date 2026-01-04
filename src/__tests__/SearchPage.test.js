import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SearchPage from '../pages/SearchPage';

jest.mock('rc-slider', () => {
  return function MockSlider({ value, onChange, ariaLabelForHandle }) {
    return (
      <div data-testid="mock-slider">
        <input
          type="number"
          aria-label={ariaLabelForHandle ? ariaLabelForHandle[0] : 'Min'}
          value={value[0]}
          onChange={(e) => onChange([Number(e.target.value), value[1]])}
        />
        <input
          type="number"
          aria-label={ariaLabelForHandle ? ariaLabelForHandle[1] : 'Max'}
          value={value[1]}
          onChange={(e) => onChange([value[0], Number(e.target.value)])}
        />
      </div>
    );
  };
});

jest.mock('../data/properties.json', () => ({
  properties: [
    {
      id: "1",
      type: "House",
      bedrooms: 3,
      price: 450000,
      tenure: "Freehold",
      description: "A lovely house.",
      location: "Crofton, London",
      picture: "house1.jpg",
      url: "house1.html",
      added: { month: "January", day: 12, year: 2023 }
    },
    {
      id: "2",
      type: "Flat",
      bedrooms: 2,
      price: 300000,
      tenure: "Leasehold",
      description: "A modern flat.",
      location: "Manchester",
      picture: "flat1.jpg",
      url: "flat1.html",
      added: { month: "March", day: 15, year: 2023 }
    },
    {
      id: "3",
      type: "House",
      bedrooms: 5,
      price: 850000,
      tenure: "Freehold",
      description: "A large family home.",
      location: "Leeds",
      picture: "house2.jpg",
      url: "house2.html",
      added: { month: "May", day: 20, year: 2023 }
    }
  ]
}));

const renderWithProviders = (component) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </DndProvider>
  );
};

describe('SearchPage Component', () => {
  
  // Test 01: Render Check: Verify page renders and displays properties
  test('1. Render Check: Verify page renders and displays properties', () => {
    renderWithProviders(<SearchPage />);
    
    expect(screen.getByText(/Homes for sale in/i)).toBeInTheDocument();
    
    expect(screen.getByText('Crofton')).toBeInTheDocument();
    expect(screen.getByText('Manchester')).toBeInTheDocument();
    expect(screen.getByText('Leeds')).toBeInTheDocument();
  });

  // Test 02: Filter Logic: Simulate typing into Location filter
  test('2. Filter Logic: Simulate typing into Location filter', async () => {
    renderWithProviders(<SearchPage />);
    
    const locationInput = screen.getByLabelText(/Location/i);
    
    fireEvent.change(locationInput, { target: { value: 'Crofton' } });
    
    await waitFor(() => {
      expect(screen.getByText('Crofton')).toBeInTheDocument();
      expect(screen.queryByText('Manchester')).not.toBeInTheDocument();
      expect(screen.queryByText('Leeds')).not.toBeInTheDocument();
    });
  });

  // Test 03: Bedroom Filter: Simulate moving bedroom slider
  test('3. Bedroom Filter: Simulate moving bedroom slider', async () => {
    renderWithProviders(<SearchPage />);
    
    const minInput = screen.getByLabelText('Min Bedrooms');
    
    fireEvent.change(minInput, { target: { value: '5' } });
    
    await waitFor(() => {
      expect(screen.getByText('Leeds')).toBeInTheDocument();
      expect(screen.queryByText('Crofton')).not.toBeInTheDocument();
      expect(screen.queryByText('Manchester')).not.toBeInTheDocument();
    });
  });

  // Test 04: Add Favourite: Simulate clicking the Heart button
  test('4. Add Favourite: Simulate clicking the Heart button', async () => {
    renderWithProviders(<SearchPage />);
    
    const favButtons = screen.getAllByLabelText('Add to favourites');
    const firstBtn = favButtons[0];
    
    fireEvent.click(firstBtn);
    
    await waitFor(() => {
      expect(screen.getByText('SAVED ITEMS')).toBeInTheDocument();
      const sidebarItems = screen.getAllByText('Crofton');
      expect(sidebarItems.length).toBeGreaterThan(1);
    });
  });

  // Test 05: Remove Favourite: Simulate clicking the X button
  test('5. Remove Favourite: Simulate clicking the X button', async () => {
    renderWithProviders(<SearchPage />);
    
    const favButtons = screen.getAllByLabelText('Add to favourites');
    fireEvent.click(favButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText('SAVED ITEMS')).toBeInTheDocument();
    });
    
    const removeBtn = screen.getByLabelText('Remove favourite');
    fireEvent.click(removeBtn);
    
    await waitFor(() => {
      expect(screen.queryByText('SAVED ITEMS')).not.toBeInTheDocument();
    });
  });
});
