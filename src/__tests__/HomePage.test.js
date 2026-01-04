import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock data
jest.mock('../data/properties.json', () => ({
  properties: [
    {
      id: "prop1",
      type: "House",
      bedrooms: 3,
      price: 750000,
      tenure: "Freehold",
      description: "Test House Description",
      location: "Test Location",
      picture: "images/prop1/img1.webp",
      images: ["images/prop1/img1.webp"]
    },
    {
      id: "prop2",
      type: "Flat",
      bedrooms: 2,
      price: 399995,
      tenure: "Leasehold",
      description: "Test Flat Description",
      location: "Test Location 2",
      picture: "images/prop2/img1.webp",
      images: ["images/prop2/img1.webp"]
    },
    {
      id: "prop3",
      type: "House",
      bedrooms: 4,
      price: 850000,
      tenure: "Freehold",
      description: "Test House 2 Description",
      location: "Test Location 3",
      picture: "images/prop3/img1.webp",
      images: ["images/prop3/img1.webp"]
    }
  ]
}));

describe('HomePage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  // Test 01: Render: Hero section and search bar
  test('renders hero section and search bar', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Find your place to call home/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Where do you want to live/i)).toBeInTheDocument();
  });

  // Test 02: Interaction: Update search input
  test('updates search input value', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Where do you want to live/i);
    fireEvent.change(input, { target: { value: 'London' } });
    expect(input.value).toBe('London');
  });

  // Test 03: Navigation: Search form submission
  test('navigates to search page on form submission', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Where do you want to live/i);
    fireEvent.change(input, { target: { value: 'London' } });
    
    const form = input.closest('form');
    fireEvent.submit(form);

    expect(mockNavigate).toHaveBeenCalledWith('/search?location=London');
  });

  // Test 04: Render: Featured properties
  test('renders featured properties', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Featured Properties')).toBeInTheDocument();
    // Should render 3 cards based on the mock data slice(0,3)
    const cards = screen.getAllByText(/Bed/i); 
    expect(cards).toHaveLength(3);
  });

  // Test 05: Navigation: Click property card
  test('navigates to property page when card is clicked', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const propertyCard = screen.getByText('Test Location').closest('.card');
    fireEvent.click(propertyCard);

    expect(mockNavigate).toHaveBeenCalledWith('/property/prop1');
  });

  // Test 06: Navigation: Click View All button
  test('navigates to search page when View All is clicked', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    const viewAllBtn = screen.getByText('View All');
    fireEvent.click(viewAllBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/search');
  });
});
