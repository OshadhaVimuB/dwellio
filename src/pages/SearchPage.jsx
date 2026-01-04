import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams, Link } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Slider from 'rc-slider';
import { useDrag, useDrop } from 'react-dnd';
import NavBar from '../components/Layout/NavBar';
import Footer from '../components/Layout/Footer';
import propertiesData from '../data/properties.json';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-slider/assets/index.css';
import './SearchPage.css';

const ItemTypes = {
  PROPERTY: 'PROPERTY',
  FAVOURITE: 'FAVOURITE'
};

/**
 * SearchCard Component
 * Displays a single property card that can be dragged.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.property - The property data object.
 * @param {boolean} props.isFavourite - Whether the property is currently favourited.
 * @param {Function} props.toggleFav - Function to toggle favourite status.
 * @returns {JSX.Element} The rendered component.
 */
const SearchCard = ({ property, isFavourite, toggleFav }) => {
  // Drag hook to make the card draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PROPERTY,
    item: { id: property.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [property.id]);

  return (
    <div ref={drag} className={`search-card ${isDragging ? 'dragging' : ''}`} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div className="sc-img">
        <img
          src={`/${property.picture}`}
          alt={property.type}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300';
          }}
        />
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFav(property.id);
          }} 
          className="fav-icon-btn"
          type="button"
          aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          {isFavourite ? '♥' : '♡'}
        </button>
      </div>
      <div className="sc-body">
        <div className="sc-top">
          <h3>{property.location?.split(',')[0]}</h3>
          <span className="sc-price">£{property.price?.toLocaleString()}</span>
        </div>
        <p className="sc-desc">
          {property.type} • {property.bedrooms} Beds
        </p>
        <Link to={`/property/${property.id}`} className="sc-link">
          View Details
        </Link>
      </div>
    </div>
  );
};

SearchCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    picture: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.number,
    bedrooms: PropTypes.number,
  }).isRequired,
  isFavourite: PropTypes.bool.isRequired,
  toggleFav: PropTypes.func.isRequired,
};

/**
 * DraggableFavItem Component
 * Displays a favourited item in the sidebar that can be dragged out to remove.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.property - The property data object.
 * @param {Function} props.removeFav - Function to remove the property from favourites.
 * @returns {JSX.Element} The rendered component.
 */
const DraggableFavItem = ({ property, removeFav }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FAVOURITE,
    item: { id: property.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [property.id]);

  return (
    <div ref={drag} className="fav-item-row" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img 
        src={`/${property.picture}`} 
        alt={property.type}
        className="fav-item-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/100';
        }}
      />
      <div className="fav-item-info">
          <div className="fav-item-price">£{property.price.toLocaleString()}</div>
          <div className="fav-item-addr">{property.location.split(',')[0]}</div>
      </div>
      <button 
        onClick={() => removeFav(property.id)}
        className="fav-item-delete"
        type="button"
        aria-label="Remove favourite"
      >
        X
      </button>
    </div>
  );
};

DraggableFavItem.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    picture: PropTypes.string,
    type: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  removeFav: PropTypes.func.isRequired,
};

/**
 * SearchPage Component
 * Main page for searching properties with filters and a favourites sidebar.
 * Implements drag-and-drop functionality for favourites.
 * 
 * @returns {JSX.Element} The rendered page.
 */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  
  // Get location from URL query parameter
  const urlLocation = useMemo(() => searchParams.get('location') || '', [searchParams]);
  
  // -- Filter States --
  const [loc, setLoc] = useState(urlLocation);
  const [price, setPrice] = useState([100000, 3000000]);
  const [bedrooms, setBedrooms] = useState([1, 10]);
  const [type, setType] = useState(null);
  const [date, setDate] = useState(null);
  
  // -- Data State --
  const [favourites, setFavourites] = useState([]);

  // Sync local state with URL location parameter
  useEffect(() => {
    if (urlLocation) {
      setLoc(urlLocation);
    }
  }, [urlLocation]);

  /**
   * Filter Logic
   * Uses useMemo to efficiently filter properties based on all active criteria.
   * This prevents re-calculation on every render unless dependencies change.
   */
  const filtered = useMemo(() => {
    if (!propertiesData || !propertiesData.properties) return [];

    let res = [...propertiesData.properties];
    
    // Filter by Location (partial match, case-insensitive)
    if (loc) {
      res = res.filter(p => 
        p.location && p.location.toLowerCase().includes(loc.toLowerCase())
      );
    }
    
    // Filter by Property Type
    if (type && type.value && type.value !== 'Any') {
      res = res.filter(p => p.type === type.value);
    }
    
    // Filter by Price Range
    res = res.filter(p => (p.price || 0) >= price[0] && (p.price || 0) <= price[1]);
    
    // Filter by Bedroom Count
    res = res.filter(p => (p.bedrooms || 0) >= bedrooms[0] && (p.bedrooms || 0) <= bedrooms[1]);

    // Filter by Date Added
    if (date) {
      res = res.filter(p => {
        try {
          if (!p.added) return false;
          const pDate = new Date(`${p.added.month} ${p.added.day}, ${p.added.year}`);
          return pDate >= date;
        } catch (e) {
          return true;
        }
      });
    }
    
    return res;
  }, [loc, price, bedrooms, type, date]);

  /**
   * Toggles a property ID in the favourites list.
   * @param {string} id - The property ID to toggle.
   */
  const toggleFav = (id) => {
    setFavourites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // -- Drag and Drop Monitors --

  // Drop target for adding to favourites (Sidebar)
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PROPERTY,
    drop: (item) => {
      if (!favourites.includes(item.id)) {
        toggleFav(item.id);
      }
    },
  }), [favourites]);

  // Drop target for removing from favourites (Main Area)
  const [{ isOver }, dropRemove] = useDrop(() => ({
    accept: ItemTypes.FAVOURITE,
    drop: (item) => {
      if (favourites.includes(item.id)) {
        toggleFav(item.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [favourites]);

  const typeOptions = [
    { value: 'Any', label: 'Any' },
    { value: 'House', label: 'House' },
    { value: 'Flat', label: 'Flat' },
  ];

  return (
    <>
      <NavBar />

      <div className="search-page-layout">
        {/* Filters Sidebar */}
        <aside className="filters">
          <div className="filter-box">
            <h3>Filters</h3>

            <div className="form-group">
              <label htmlFor="location-input">Location</label>
              <input
                id="location-input"
                type="text"
                value={loc}
                onChange={e => setLoc(e.target.value)}
                className="std-input"
                placeholder="City, Postcode"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <Select
                options={typeOptions}
                value={type}
                onChange={setType}
                placeholder="Any"
                isClearable
                aria-label="Select Property Type"
              />
            </div>

            <div className="form-group">
              <label>Price Range: £{price[0].toLocaleString()} - £{price[1].toLocaleString()}</label>
              <Slider
                range
                min={100000}
                max={3000000}
                step={50000}
                value={price}
                onChange={setPrice}
                ariaLabelForHandle={['Min Price', 'Max Price']}
              />
            </div>

            <div className="form-group">
              <label>Bedrooms: {bedrooms[0]} - {bedrooms[1]}</label>
              <Slider
                range
                min={1}
                max={10}
                step={1}
                value={bedrooms}
                onChange={setBedrooms}
                ariaLabelForHandle={['Min Bedrooms', 'Max Bedrooms']}
              />
            </div>

            <div className="form-group">
              <label>Added After</label>
              <DatePicker
                selected={date}
                onChange={setDate}
                className="std-input"
                placeholderText="Select date"
                isClearable
              />
            </div>
          </div>

          <div className="dream-list-container">
            <div className="dream-header">
                <div className="dream-title">
                    <span className="heart-icon">♥</span>
                    <h2>Favorites</h2>
                </div>
                <span className="count-badge">{favourites.length}</span>
            </div>

            <div ref={drop} className="new-drop-zone">
                <div className="drop-content">
                    <div className="drop-icon">+</div>
                    <p className="drop-text">Drag properties here</p>
                    <p className="drop-subtext">Add to your favourites to compare later</p>
                </div>
            </div>

            {favourites.length > 0 && (
                <div className="saved-items-section">
                    <h4 className="saved-header">SAVED ITEMS</h4>
                    <div className="saved-list">
                        {propertiesData.properties
                            .filter(p => favourites.includes(p.id))
                            .map(p => (
                                <DraggableFavItem
                                    key={p.id}
                                    property={p}
                                    removeFav={toggleFav}
                                />
                            ))}
                    </div>
                </div>
            )}
          </div>
        </aside>

        {/* Results Area */}
        <main ref={dropRemove} className="results-area">
          {isOver && <div className="remove-overlay" />}
          <div className="res-header">
            <h1>Homes for sale in {loc || 'UK'}</h1>
            <p>{filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found</p>
          </div>

          <div className="results-grid">
            {filtered.length > 0 ? (
              filtered.map(p => (
                <SearchCard
                  key={p.id}
                  property={p}
                  isFavourite={favourites.includes(p.id)}
                  toggleFav={toggleFav}
                />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--light-text)', fontSize: '1.1rem' }}>
                  No properties found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default SearchPage;