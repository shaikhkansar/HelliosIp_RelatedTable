import React, { useState, useEffect } from 'react';

const PatentForAnnuities = ({ annuityID }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    console.log("Fetching data for annuity ID:", annuityID);
    const fetchData = async () => {
      try {
        const response = await fetch('https://prod-156.westus.logic.azure.com:443/workflows/81462bc99b184115b59100fcd6e15813/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=sy3M2pZxs1ZtVRI9PuUJ2J-gz6Xo4ov4NhGAwuIXu_Q', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "_hip_clientinstructionproject_value": annuityID
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("Fetched data:", data); // Log fetched data
        setDetails(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [annuityID]);

  return (
    <div style={{marginLeft:"150px"}}>
      <h1>Patent For Annuities</h1>
      {Array.isArray(details) && details.length > 0 ? (
        details.map((item, index) => (
          <div key={index}>
            <p>Ref.No: {item['Ref.No']}</p>
          </div>
        ))
      ) : (
        <p>No details available</p>
      )}
    </div>
  );
};

export default PatentForAnnuities;
