import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/Layout/NavBar';
import Footer from '../components/Layout/Footer';
import propertiesData from '../data/properties.json';
import './HomePage.css';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?location=${encodeURIComponent(search)}`);
  };

  return (
    <>
      <NavBar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Find your place to call home.</h1>
          <p>Search properties for sale and to rent across the UK.</p>
          
          <form className="search-bar-pill" onSubmit={handleSearch}>
            <div className="input-wrap">
              <label>Location</label>
              <input 
                type="text" 
                placeholder="Where do you want to live?" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn-round">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured container">
        <div className="section-header">
          <h2>Featured Properties</h2>
          <button className="btn-outline" onClick={() => navigate('/search')}>View All</button>
        </div>
        
        <div className="grid-3">
          {propertiesData.properties.slice(0, 3).map(property => (
            <div key={property.id} className="card" onClick={() => navigate(`/property/${property.id}`)}>
              <div className="card-img">
                <img src={`/${property.picture}`} alt={property.type} onError={(e)=>e.target.src='https://via.placeholder.com/400'}/>
                <span className="badge">{property.type}</span>
              </div>
              <div className="card-info">
                <div className="card-row">
                  <h3>{property.location.split(',')[0]}</h3>
                  <span className="star">★ 4.9</span>
                </div>
                <p className="card-desc">{property.bedrooms} Bed • {property.tenure}</p>
                <div className="card-price">£{property.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;