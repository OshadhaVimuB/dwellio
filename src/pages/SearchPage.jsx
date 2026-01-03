import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import Slider from 'rc-slider';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import NavBar from '../components/Layout/NavBar';
import Footer from '../components/Layout/Footer';
import propertiesData from '../data/properties.json';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-slider/assets/index.css';
import './SearchPage.css';

/* Draggable Card Component */
const SearchCard = ({ property, isFavourite, toggleFav }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PROPERTY',
    item: { id: property.id },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <div ref={drag} className={`search-card ${isDragging ? 'dragging' : ''}`}>
      <div className="sc-img">
        <img
          src={`/${property.picture}`}
          alt={property.type}
          onError={(e) => (e.target.src = 'https://via.placeholder.com/300')}
        />
        <button onClick={() => toggleFav(property.id)} className="fav-icon-btn">
          {isFavourite ? '♥' : '♡'}
        </button>
      </div>
      <div className="sc-body">
        <div className="sc-top">
          <h3>{property.location.split(',')[0]}</h3>
          <span className="sc-price">£{property.price.toLocaleString()}</span>
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

/* Main Search Page Component */
const SearchPage = () => {
  const [params] = useSearchParams();
  
  // Data State
  const [properties] = useState(propertiesData.properties);
  const [filtered, setFiltered] = useState(properties);
  const [favourites, setFavourites] = useState([]);

  // Filter States
  const [loc, setLoc] = useState(params.get('location') || '');
  const [price, setPrice] = useState([100000, 3000000]);
  const [type, setType] = useState(null);
  const [date, setDate] = useState(null);

  useEffect(() => {
    const locationFromUrl = params.get('location');
    if (locationFromUrl !== null) {
      setLoc(locationFromUrl);
    }
  }, [params]);

  // Filtering Logic
  useEffect(() => {
    let res = properties;
    if (loc) res = res.filter(p => p.location.toLowerCase().includes(loc.toLowerCase()));
    if (type && type.value !== 'Any') res = res.filter(p => p.type === type.value);
    res = res.filter(p => p.price >= price[0] && p.price <= price[1]);
    if (date) {
      res = res.filter(p => {
        const pDate = new Date(`${p.added.month} ${p.added.day}, ${p.added.year}`);
        return pDate >= date;
      });
    }
    setFiltered(res);
  }, [loc, price, type, date, properties]);

  const toggleFav = (id) =>
    setFavourites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const [, drop] = useDrop(() => ({
    accept: 'PROPERTY',
    drop: (item) => {
      if (!favourites.includes(item.id)) toggleFav(item.id);
    },
  }));

  return (
    <DndProvider backend={HTML5Backend}>
      <NavBar />

      <div className="search-page-layout container">
        {/* Filters Sidebar */}
        <aside className="filters">
          <div className="filter-box">
            <h3>Filters</h3>

            <div className="form-group">
              <label>Location</label>
              <input
                value={loc}
                onChange={e => setLoc(e.target.value)}
                className="std-input"
                placeholder="City, Postcode"
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <Select
                options={[
                  { value: 'Any', label: 'Any' },
                  { value: 'House', label: 'House' },
                  { value: 'Flat', label: 'Flat' },
                ]}
                onChange={setType}
                placeholder="Any"
              />
            </div>

            <div className="form-group">
              <label>Price</label>
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
              <label>Added After</label>
              <DatePicker
                selected={date}
                onChange={setDate}
                className="std-input"
                placeholderText="Select date"
              />
            </div>
          </div>

          <div ref={drop} className="drop-zone">
            <h3>Favourites</h3>
            {favourites.length === 0 ? (
              <p className="mute">Drag homes here</p>
            ) : (
              <div className="fav-grid">
                {properties
                  .filter(p => favourites.includes(p.id))
                  .map(p => (
                    <div key={p.id} className="fav-thumb">
                      <img src={`/${p.picture}`} alt="" />
                      <button onClick={() => toggleFav(p.id)}>×</button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </aside>

        {/* Results Area */}
        <main className="results-area">
          <div className="res-header">
            <h1>Homes for sale in {loc || 'UK'}</h1>
            <p>{filtered.length} properties found</p>
          </div>

          <div className="results-grid">
            {filtered.map(p => (
              <SearchCard
                key={p.id}
                property={p}
                isFavourite={favourites.includes(p.id)}
                toggleFav={toggleFav}
              />
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </DndProvider>
  );
};

export default SearchPage;