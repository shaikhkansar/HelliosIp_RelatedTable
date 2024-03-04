import React, { useState } from "react";
import { Save, XSquare } from "react-feather";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./EditAnnuities.css";

const EditAnnuities = ({ entry, onClose, onEdit }) => {
  const [formData, setFormData] = useState({
    AnnuitiesClientInstructionID: entry?.ClientInstructionID || "",
    Name: entry?.Name || "",
    Jurisdiction: entry?.Jurisdiction || "",
    "Instruction Date": entry?.InstructionDate || "",
    "Annuities Due Date": entry?.AnnuitiesDueDate || "",
  });
  const [response, setResponse] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEditAnnuities = async () => {
    try {
      console.log("Sending request...");
      const editedEntry = { ...entry, ...formData };
      const response = await fetch(
        "https://prod-09.centralindia.logic.azure.com:443/workflows/53cbed9ffcb64ada93f3093559b26ce4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0SmgrwmyywrGfWZFpkj4DfRlxWJhb7S4JgUG_I-Z0UI",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedEntry),
        }
      );
      console.log("Response received:", response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const updatedEntry = await response.json();
        console.log("Updated Entry:", updatedEntry);
  
        // Call the onEdit function provided by the parent component
        onEdit(updatedEntry);
      } else {
        setResponse("Non-JSON response received");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      // Close the modal or perform any other action after editing
      onClose();
    }
  };
  
  return (
    <div className="container">
     <div className="editInput">
  <div className="inputWrapper">
    {/* <label className="labelinp">Name:</label> */}
    <input
      className="form-control"
      type="text"
      name="Name"
      value={formData.Name}
      onChange={handleInputChange}
    />
  </div>
  <div className="inputWrapper">
    {/* <label className="labelinp">Jurisdiction:</label> */}
    <input
      className="form-control"
      type="text"
      name="Jurisdiction"
      value={formData.Jurisdiction}
      onChange={handleInputChange}
    />
  </div>
  <div className="inputWrapper">
    {/* <label className="labelinp">InstructionDate:</label> */}
    <input
      className="form-control"
      type="date"
      name="InstructionDate"
      value={formData.InstructionDate}
      onChange={handleInputChange}
      cursor="pointer"
    />
  </div>
  <div className="inputWrapper">
    {/* <label className="labelinp">AnnuitiesDueDate:</label> */}
    <input
      className="form-control"
      type="date"
      name="AnnuitiesDueDate"
      value={formData.AnnuitiesDueDate}
      onChange={handleInputChange}
    />
  </div>
  <div className="buttonWrapper">
    <button className="saveButton" onClick={handleEditAnnuities}>
      <Save className="icon" />
      Save
    </button>
    <button className="cancelButton" onClick={onClose}>
      <XSquare className="icon" />
      Cancel
    </button>
  </div>
</div>

      <pre>{response}</pre>
    </div>
  );
};

export default EditAnnuities;