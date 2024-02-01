import React, { useState, useEffect } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
  } from "react-super-responsive-table";
  import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
  

const InstructionProject = ({ chatid }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const encodeddata = encodeURIComponent(chatid);
        const modifiedEncodedData = encodeddata.replace(/%3A/g, "%3a");
    // Replace the URL with your Power Automate URL
    const apiUrl = 'https://prod-26.centralindia.logic.azure.com:443/workflows/efc9719714db49568aa4f67696de78f5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Fi5wVx8v9we_OXJrlBLFch_JNgrGJRN_g3Vp7fD7NpM';

    // Replace the JSON payload with your dynamic data
   

    // Make a POST request to the Power Automate endpoint
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatid: modifiedEncodedData,
      }),
    })
      .then(response => response.json())
      .then(result => {
        setData(result);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [chatid]);

  const tableStyle = {
    width: "50%",
    border: "1px solid lightgray",
    borderRadius: "5px",
    marginLeft:"450px"
  };

  const thStyle = {
    background: "lightgray",
    padding: "8px",
    borderBottom: "1px solid lightgray",
  };
  const thTdStyle = {
    padding: "8px",
    border: "1px solid lightgray",
  };

  const cellStyle = {
    padding: "8px",
    borderBottom: "1px solid lightgray",
  };

  return (
    <div>
      {data ? (
       <Table style={tableStyle}>
       <Thead>
         <Tr>
           <Th style={thStyle}>Instruction</Th>
           <Th style={thStyle}>Project</Th>
         </Tr>
       </Thead>
       <Tbody>
         {data.length > 0 && (
           Object.keys(data[0]).map((property, index) => (
             <Tr key={index}>
               <Td style={thTdStyle}>{property}</Td>
               <Td style={thTdStyle}>{data[0][property]}</Td>
             </Tr>
           ))
         )}
       </Tbody>
     </Table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default InstructionProject;
