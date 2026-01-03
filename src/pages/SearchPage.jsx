import React, { useState, useEffect, useMemo } from 'react';
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

/* Draggable Card Component */
const SearchCard = ({ property, isFavourite, toggleFav }) => {
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

/* Draggable Favourite Item Component */
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
      >
        X
      </button>
    </div>
  );
};

/* Main Search Page Component */
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  
  // Get location from URL
  const urlLocation = useMemo(() => searchParams.get('location') || '', [searchParams]);
  
  // Filter States
  const [loc, setLoc] = useState(urlLocation);
  const [price, setPrice] = useState([100000, 3000000]);
  const [bedrooms, setBedrooms] = useState([1, 10]);
  const [type, setType] = useState(null);
  const [date, setDate] = useState(null);
  
  // Data State
  const [favourites, setFavourites] = useState([]);

  // Update location when URL changes
  useEffect(() => {
    if (urlLocation) {
      setLoc(urlLocation);
    }
  }, [urlLocation]);

  // Filtering Logic with useMemo for performance
  const filtered = useMemo(() => {
    if (!propertiesData || !propertiesData.properties) return [];

    let res = [...propertiesData.properties];
    
    if (loc) {
      res = res.filter(p => 
        p.location && p.location.toLowerCase().includes(loc.toLowerCase())
      );
    }
    
    if (type && type.value && type.value !== 'Any') {
      res = res.filter(p => p.type === type.value);
    }
    
    res = res.filter(p => (p.price || 0) >= price[0] && (p.price || 0) <= price[1]);
    
    res = res.filter(p => (p.bedrooms || 0) >= bedrooms[0] && (p.bedrooms || 0) <= bedrooms[1]);

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

  const toggleFav = (id) => {
    setFavourites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PROPERTY,
    drop: (item) => {
      if (!favourites.includes(item.id)) {
        toggleFav(item.id);
      }
    },
  }), [favourites]);

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
              <label>Location</label>
              <input
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