import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { UserPlus } from "react-feather";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';
import "./App.css"
import "react-datepicker/dist/react-datepicker.css";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const AddAnnuities = ({ onAddEntry }) => {
  const [newEntry, setNewEntry] = useState({
    Name: "",
    Jurisdiction: "",
    InstructionDate: "",
    AnnuitiesDueDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    return date
      ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
          .getDate()
          .toString()
          .padStart(2, "0")}`
      : null;
  };
  

  const addEntry = async () => {
      
      const formattedEntry = {
          ...newEntry,
          InstructionDate: formatDate(newEntry.InstructionDate),
          AnnuitiesDueDate: formatDate(newEntry.AnnuitiesDueDate),
          AnnuitiesID: "d4fe221f-99bf-ee11-9079-0022486e6d69",
        };
        
        // Convert date strings to numeric values
        formattedEntry.InstructionDate = formattedEntry.InstructionDate.toString();
        formattedEntry.AnnuitiesDueDate = formattedEntry.AnnuitiesDueDate.toString();
        console.log("user data", formattedEntry)
        try {
        const apiUrl =
          "https://prod-12.centralindia.logic.azure.com:443/workflows/bc7faeecf9be472991c1fc22edf34600/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Cp2wPVLh-UjGXpxKgN4GH8QJUjkgyrfYnsMtPRzwNxw";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedEntry),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
    // Read response body once and store it in a variable
    const responseBody = await response.text();
    console.log('Response body:', responseBody);

    if (response.ok) {
        let contentType = response.headers ? response.headers.get('Content-Type') : null;

        // If Content-Type is null or undefined, assume JSON
        if (!contentType) {
          console.warn('Assuming response is in JSON format (Content-Type is null or undefined)');
          contentType = 'application/json';
        }

      console.log('Response Content-Type:', contentType);

      if (contentType.includes('application/json')) {
        if (responseBody) {
          try {
            const jsonData = JSON.parse(responseBody);
              // Check if the response contains information about the status or a link to check the status
              if (jsonData.status === 'completed') {
                console.log('New entry added successfully', jsonData);
                onAddEntry(formattedEntry);
                // You may want to set up a mechanism to check the status later using the provided link.
                // For example, you can use a setTimeout to periodically check the status.
                // setTimeout(async () => {
                //   // Make a new request to the statusLink to check the updated status
                //   const statusResponse = await fetch(jsonData.statusLink);
        
                //   if (statusResponse.ok) {
                //     const updatedStatusData = await statusResponse.json();
        
                //     if (updatedStatusData.status === 'completed') {
                //       console.log('New entry added successfully', updatedStatusData);
                //       onAddEntry();
                //     } else {
                //       console.log('The request is still pending. Check status later.');
                //     }
                //   } else {
                //     console.error('Failed to check status:', statusResponse.status);
                //   }
                // }, 5000); // Set the interval as needed
              } else {
                console.log('New entry added successfully', jsonData);
                onAddEntry();
              }
            } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
          }
        } else {
          console.warn('Response body is empty');
        }
      } else {
        console.error('Response is not in JSON format');
      }
    } else {
      console.error('Failed to add new entry');
    }
  } catch (error) {
    console.error('Error during fetch operation:', error);
  }
  
  };
  console.log("new entry",newEntry.InstructionDate)

  return (
    <div>
      <h4>Annuities - (Annuities 1)</h4>
      <h5>Add Client Instruction </h5>
      <Table className="SuperResponsiveTable table-border table-striped">
        <Tbody>
          <Tr>
            <Td>
              <label>
                Name:
                <input
                  type="text"
                  name="Name"
                  value={newEntry.Name}
                  onChange={handleInputChange}
                />
              </label>
            </Td>
            <Td>
              <label>
                Jurisdiction:
                <input
                  type="text"
                  name="Jurisdiction"
                  value={newEntry.Jurisdiction}
                  onChange={handleInputChange}
                />
              </label>
            </Td>
            <Td>
              <label>
                Instruction Date:
                <DatePicker
                  selected={newEntry.InstructionDate}
                  onChange={(date) =>
                    setNewEntry({ ...newEntry, InstructionDate: date })
                  }
                  dateFormat="yyyy-MM-dd"
                />
              </label>
            </Td>
            <Td>
              <label>
                Annuities Due Date:
                <DatePicker
                  selected={newEntry.AnnuitiesDueDate}
                  onChange={(date) =>
                    setNewEntry({ ...newEntry, AnnuitiesDueDate: date })
                  }
                  dateFormat="yyyy-MM-dd"
                />
              </label>
            </Td>
            <Td>
              <button  className="btn btn-success" type="submit" onClick={addEntry} >
              <UserPlus  />
              {/* type="submit"
                className="btn btn-success"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Add Employees"
                onClick={handleSubmit} */}
              </button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );
};

export default AddAnnuities;
