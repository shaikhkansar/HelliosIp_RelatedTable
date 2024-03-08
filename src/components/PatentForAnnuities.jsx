import React, { useState, useEffect } from 'react';
import Data  from "./Data.json";

const PatentForAnnuities = () => {
  const [details, setDetails] = useState([]);

  useEffect(() => {
    fetch( Data[2].url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "_hip_clientinstructionproject_value": "2cf58e76-2a7e-ec11-8d21-000d3a5ca879"
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setDetails(data);
      })
      .catch(error => console.error('Error fetching details:', error));
  }, []);

  return (
    <div>
      <h1>Details</h1>
      {details.map((item, index) => (
        <div key={index}>
          <p>Ref. No: {item['Ref.No']}</p>
          <p>Matter Type: {item.MatterType}</p>
          <p>Title: {item.Title}</p>
        </div>
      ))}
      {details.length === 0 && <p>Loading...</p>}
      {/* Add error handling here if needed */}
    </div>
  );
}

export default PatentForAnnuities;
