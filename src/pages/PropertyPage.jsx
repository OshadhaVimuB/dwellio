import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import NavBar from '../components/Layout/NavBar';
import Footer from '../components/Layout/Footer';
import propertiesData from '../data/properties.json';
import 'react-tabs/style/react-tabs.css';
import './PropertyPage.css';

const PropertyPage = () => {
  // Get property ID
  const { id } = useParams();
  const property = propertiesData.properties.find(p => p.id === id);
  
  // Image state
  const [activeImg, setActiveImg] = useState(property ? `/${property.picture}` : '');

  if(!property) return <div>Not Found</div>;
  
  // Gallery logic
  const gallery = property.images && Array.isArray(property.images) 
    ? property.images.map(img => `/${img}`) 
    : [`/${property.picture}`];

  return (
    <>
      <NavBar />
      <div className="property-page container">
        
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

        <div className="prop-gallery">
          <div className="main-pic">
            <img src={activeImg} alt="main" onError={(e)=>e.target.src='https://via.placeholder.com/800'}/>
          </div>
          <div className="side-pics">
             {gallery.map((img, i) => (
               <img 
                 key={i} 
                 src={img} 
                 alt={`Gallery view ${i + 1}`} 
                 onClick={() => setActiveImg(img)}
                 className={activeImg === img ? 'active' : ''}
               />
             ))}
          </div>
        </div>

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
                <div className="floor-plan-box">
                  <img src="/images/floor1.webp" alt="Floor Plan" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
              </TabPanel>
              <TabPanel>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d875.9411950569352!2d-0.13873834167914542!3d51.49815301758104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604ddd4f5b499%3A0x92749d1f1f35e976!2sCorinthian%20Sports!5e1!3m2!1sen!2sin!4v1767515910031!5m2!1sen!2sin" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
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