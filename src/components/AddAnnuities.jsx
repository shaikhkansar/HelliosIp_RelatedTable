import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserPlus, SkipBack, ArrowLeft } from "react-feather";
import "./AddAnnuities.css";
import Tabs from "./Tabs";
import { useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const AddAnnuities = ({ onAddEntry }) => {
  const initialEntryState = {
    Name: "",
    Jurisdiction: "",
    InstructionDate: null,
    AnnuitiesDueDate: null,
  };
  const [newEntry, setNewEntry] = useState({ ...initialEntryState });
  const [showAlert, setShowAlert] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hovered, setHovered] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prevEntry) => ({
      ...prevEntry,
      [name]: value,
    }));
  };

  const formatDate = (date) => {
    return date
      ? `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
      : null;
  };

  const resetForm = () => {
    setNewEntry({ ...initialEntryState });
  };

  const addEntry = async () => {
    const { AnnuitiesID, ...formattedEntry } = newEntry;

    const formattedInstructionDate = newEntry.InstructionDate
      ? formatDate(newEntry.InstructionDate)
      : null;
    const formattedAnnuitiesDueDate = newEntry.AnnuitiesDueDate
      ? formatDate(newEntry.AnnuitiesDueDate)
      : null;

    formattedEntry.InstructionDate = formattedInstructionDate;
    formattedEntry.AnnuitiesDueDate = formattedAnnuitiesDueDate;

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

      console.log("Request URL:", apiUrl);

      if (response.status === 202) {
        console.log("Response status:", response.status);
      } else if (response.ok) {
        console.log("Response status:", response.status);

        const responseData = await response.json();
        console.log("Parsed JSON response:", responseData);

        setShowAlert(true);

        resetForm();
      } else {
        console.error(
          "Failed to add new entry. Server returned status:",
          response.status
        );
        const errorText = await response.text();
        console.error("Error text:", errorText);
      }
    } catch (error) {
      console.error("Error adding new entry:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <Tabs />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "11px",
          marginLeft: "800px",
          marginBottom: "-80px",
          color: "blue",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={handleGoBack}
      >
        <ArrowLeft
          // style={{ marginRight: "15px", marginTop: "1px", textDecoration:"none" }}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          className="backbutton"
          title="back"
        />
      </div>
      <h5
        style={{
          marginTop: "40px",
          cursor: "pointer",
          backgroundColor: hovered ? "#444791" : "transparent",
          transition: "background-color 0.3s ease",
          width: "300px",
          padding:"10px",
          borderRadius:"4px",
          color: hovered ? 'white' : '#000'
          }}
        onClick={() => setShowForm(!showForm)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        Click to Add Client Instruction
      </h5>
      {showForm && (
        <Table className="SuperResponsiveTable table-border table-striped">
          {showAlert && (
            <div className="alert alert-success" role="alert">
              Added successfully!
            </div>
          )}
          <Tbody className="addannuities">
            <Tr>
              <Td className="">
                <input
                  className="form-control responsiveTd"
                  type="text"
                  name="Name"
                  value={newEntry.Name}
                  onChange={handleInputChange}
                  placeholder="Type Name here..."
                />
              </Td>
              <Td className="">
                <input
                  className="form-control responsiveTd"
                  type="text"
                  name="Jurisdiction"
                  value={newEntry.Jurisdiction}
                  onChange={handleInputChange}
                  placeholder="Type Jurisdiction here..."
                />
              </Td>
              <Td className="">
                <DatePicker
                  placeholder="Select Date"
                  className="form-control responsiveTd"
                  selected={newEntry.InstructionDate}
                  onChange={(date) =>
                    setNewEntry({ ...newEntry, InstructionDate: date })
                  }
                  dateFormat="MM / dd / yyyy"
                  placeholderText="Select Instruction Date"
                />
              </Td>
              <Td className="">
                <DatePicker
                  className="form-control responsiveTd"
                  selected={newEntry.AnnuitiesDueDate}
                  onChange={(date) =>
                    setNewEntry({ ...newEntry, AnnuitiesDueDate: date })
                  }
                  dateFormat="MM / dd / yyyy"
                  placeholderText="Select Annuities Due Date"
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
                  <UserPlus className="addentryicn" />
                </button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}
    </div>
  );
};

export default AddAnnuities;
