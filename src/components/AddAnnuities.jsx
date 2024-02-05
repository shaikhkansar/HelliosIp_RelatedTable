import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserPlus } from "react-feather";
import { v4 as uuidv4 } from 'uuid';
import "./App.css"
import  Tabs  from "./Tabs";
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
// Test 
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
      AnnuitiesID: "5da82587-cec1-ee11-9079-0022486e6d69",
    };
  // Update the UI instantly
  onAddEntry(formattedEntry);
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

      if (response.ok) {
        const data = await response.json();
        console.log("Response from server:", data);

        // Update the UI by calling the onAddEntry prop
        onAddEntry(formattedEntry);
      } else {
        console.error("Failed to add new entry:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding new entry:", error);
    }
  };

  return (
    <div>
       <Tabs />
      <h5 style={{marginTop:"40px"}}>Add Client Instruction </h5>
      <Table className="SuperResponsiveTable table-border table-striped addannuities">
        <Tbody>
          <Tr>
            <Td>
              <label>
                Name:
                </label>
                <input
                  type="text"
                  name="Name"
                  value={newEntry.Name}
                  onChange={handleInputChange}
                />
            </Td>
            <Td>
              <label>
                Jurisdiction:
                </label>
                <input
                  type="text"
                  name="Jurisdiction"
                  value={newEntry.Jurisdiction}
                  onChange={handleInputChange}
                />
            </Td>
            <Td>
              <label>
                Instruction Date:
                </label>
                <DatePicker
                  selected={newEntry.InstructionDate}
                  onChange={(date) =>
                    setNewEntry({ ...newEntry, InstructionDate: date })
                  }
                  dateFormat="yyyy-MM-dd"
                />
            </Td>
            <Td>
              <label>
                Annuities Due Date:
                </label>
                <DatePicker
                  selected={newEntry.AnnuitiesDueDate}
                  onChange={(date) =>
                    setNewEntry({ ...newEntry, AnnuitiesDueDate: date })
                  }
                  dateFormat="yyyy-MM-dd"
                />
            </Td>
            <Td>
              <button
                className="btn btn-success addentry"
                type="submit"
                onClick={addEntry}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Add Entry"
              >
                <UserPlus />
              </button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );
};

export default AddAnnuities;
