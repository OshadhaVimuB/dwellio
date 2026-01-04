import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import NavBar from '../components/Layout/NavBar';
import Footer from '../components/Layout/Footer';
import propertiesData from '../data/properties.json';
import 'react-tabs/style/react-tabs.css';
import './PropertyPage.css';

/**
 * PropertyPage Component
 * Displays detailed information about a specific property.
 * Uses URL parameters to identify the property.
 * 
 * @returns {JSX.Element} The rendered property details page.
 */
const PropertyPage = () => {
  const { id } = useParams();
  const property = propertiesData.properties.find(p => p.id === id);
  
  // State to manage the currently displayed main image
  const [activeImg, setActiveImg] = useState(property ? `/${property.picture}` : '');

  if(!property) return <div>Not Found</div>;
  
  // Use images from property data, fallback to picture if images array is missing
  const gallery = property.images && Array.isArray(property.images) 
    ? property.images.map(img => `/${img}`) 
    : [`/${property.picture}`];

  return (
    <>
      <NavBar />
      <div className="property-page container">
        
        {/* Header */}
        <div className="prop-header">
           <h1>{property.description.substring(0, 50)}...</h1>
           <div className="prop-sub">
             <span>📍 {property.location}</span>
             <div className="actions">
               <button className="share-btn">Share</button>
               <button className="save-btn">♡ Save</button>
             </div>
           </div>
        </div>

        {/* Gallery */}
        <div className="prop-gallery">
          <div className="main-pic">
            <img src={activeImg} alt="main" onError={(e)=>e.target.src='https://via.placeholder.com/800'}/>
          </div>
          <div className="side-pics">
             {gallery.slice(1, 5).map((img, i) => (
               <img key={i} src={img} alt={`Gallery view ${i + 1}`} onClick={() => setActiveImg(img)}/>
             ))}
          </div>
        </div>

        {/* Content */}
        <div className="prop-content">
          <div className="details-main">
            <div className="host-block">
               <h2>{property.type} hosted by Dwellio</h2>
               <p>{property.bedrooms} Bed • {property.tenure}</p>
            </div>
            <div className="divider"></div>
            
            <Tabs>
              <TabList>
                <Tab>Description</Tab>
                <Tab>Floor Plan</Tab>
                <Tab>Map</Tab>
              </TabList>
              <TabPanel>
                <p className="desc-body">{property.description}</p>
              </TabPanel>
              <TabPanel>
                <div className="placeholder-box">Floor Plan Placeholder</div>
              </TabPanel>
              <TabPanel>
                <div className="placeholder-box">Map Placeholder</div>
              </TabPanel>
            </Tabs>
          </div>

          <div className="booking-sidebar">
             <div className="booking-card">
               <div className="card-top">
                 <span className="price-xl">£{property.price.toLocaleString()}</span>
               </div>
               <button className="btn-primary full-width">Contact Agent</button>
             </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

PropertyPage.propTypes = {};

export default PropertyPage;