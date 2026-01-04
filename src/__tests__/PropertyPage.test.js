import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PropertyPage from '../pages/PropertyPage';

// Mock params
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
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
      images: [
        "images/prop1/img1.webp",
        "images/prop1/img2.webp",
        "images/prop1/img3.webp"
      ]
    }
  ]
}));

describe('PropertyPage Component', () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ id: 'prop1' });
  });

  // Test 01: Render: Property details
  test('renders property details correctly', () => {
    render(
      <BrowserRouter>
        <PropertyPage />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/Test House Description/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Test Location/i)).toBeInTheDocument();
    expect(screen.getByText(/£750,000/i)).toBeInTheDocument();
    expect(screen.getByText(/3 Bed/i)).toBeInTheDocument();
  });

  // Test 02: Render: Gallery images
  test('renders gallery images', () => {
    render(
      <BrowserRouter>
        <PropertyPage />
      </BrowserRouter>
    );

    const mainImage = screen.getByAltText('main');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', '/images/prop1/img1.webp');

    const sideImages = screen.getAllByAltText(/Gallery view/i);
    expect(sideImages).toHaveLength(3);
  });

  // Test 03: Interaction: Change main image
  test('changes main image when side image is clicked', () => {
    render(
      <BrowserRouter>
        <PropertyPage />
      </BrowserRouter>
    );

    const sideImages = screen.getAllByAltText(/Gallery view/i);
    const secondImage = sideImages[1];

    fireEvent.click(secondImage);

    const mainImage = screen.getByAltText('main');
    expect(mainImage).toHaveAttribute('src', '/images/prop1/img2.webp');
  });

  // Test 04: Interaction: Switch tabs
  test('renders tabs and switches content', () => {
    render(
      <BrowserRouter>
        <PropertyPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Test House Description')).toBeInTheDocument();

    const floorPlanTab = screen.getByText('Floor Plan');
    fireEvent.click(floorPlanTab);
    expect(screen.getByAltText('Floor Plan')).toBeInTheDocument();

    const mapTab = screen.getByText('Map');
    fireEvent.click(mapTab);
  });

  // Test 05: Render: Not Found state
  test('renders Not Found for invalid property id', () => {
    mockUseParams.mockReturnValue({ id: 'invalid-id' });
    render(
      <BrowserRouter>
        <PropertyPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });
});
