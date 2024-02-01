import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import './App.css';

const InstructionProject = ({ chatid }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const encodedData = encodeURIComponent(chatid);
        const modifiedEncodedData = encodedData.replace(/%3A/g, '%3a');
        const apiUrl =
          'https://prod-26.centralindia.logic.azure.com:443/workflows/efc9719714db49568aa4f67696de78f5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Fi5wVx8v9we_OXJrlBLFch_JNgrGJRN_g3Vp7fD7NpM';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatid: modifiedEncodedData,
          }),
        });

        const result = await response.json();

        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      // Cleanup function to set isMounted to false when the component is unmounted
      isMounted = false;
    };
  }, [chatid]);

  const tableStyle = {
    width: '50%',
    border: '1px solid lightgray',
    borderRadius: '5px',
    marginLeft: '450px',
  };

  const thStyle = {
    background: 'lightgray',
    padding: '8px',
    borderBottom: '1px solid lightgray',
  };

  const thTdStyle = {
    padding: '8px',
    border: '1px solid lightgray',
  };

  const cellStyle = {
    padding: '8px',
    borderBottom: '1px solid lightgray',
  };

  return (
    <div>
      {loading ? (
        <p></p>
      ) : (
        <Table style={tableStyle}>
          <Thead>
            <Tr>
              <Th style={thStyle} colSpan="2">
                Instruction Project
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.length > 0 ? (
              Object.keys(data[0]).map((property, index) => (
                <Tr key={index}>
                  <Td style={thTdStyle}>{property}</Td>
                  <Td style={thTdStyle}>{data[0][property]}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="2">No data available</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </div>
  );
};

export default InstructionProject;
