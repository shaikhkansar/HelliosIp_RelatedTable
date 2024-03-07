import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Data from "./Data.json";
import { Edit } from "react-feather";

const Anuuities = ({ chatid }) => {
  const [instructionType, setInstructionType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the item being edited
  const [editedFields, setEditedFields] = useState({});

  const fetchData = async () => {
    try {
      const encodeddata = encodeURIComponent(chatid);
      const modifiedEncodedData = encodeddata.replace(/%3A/g, "%3a");
  
      const response = await fetch(Data[1].url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatid: modifiedEncodedData,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error fetching meeting details");
      }
  
      const responseData = await response.json();
  
      if (!Array.isArray(responseData) || responseData.length === 0) {
        throw new Error("Meeting details not found");
      }
  
      setInstructionType(responseData);
      setError(null);
      setLoading(false);
  
      console.log("Meeting details:", responseData);
    } catch (error) {
      setError(`Error fetching meeting details: ${error.message}`);
      setLoading(false);
      console.error("Error fetching meeting details", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [chatid]);

  const handleEditClick = (index) => {
    setEditIndex(index);
  };

  const handleInputChange = (e, key) => {
    setEditedFields({
      ...editedFields,
      [key]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Get the hip_annuity value for the current editIndex
      const hipAnnunity = instructionType[editIndex].hip_annuity;
  
      // Construct the payload with the edited fields and hip_annuity
      const editedData = {
        hip_annuity: "355e5ea6-a0fc-ec11-82e5-000d3a339091",
        PayTerm: editedFields["PayTerm"] || instructionType[editIndex].PayTerm,
        PayYear: editedFields["PayYear"] || instructionType[editIndex].PayYear,
      };
  
      // Make a POST request to the endpoint with the payload
      const response = await fetch("https://prod-143.westus.logic.azure.com:443/workflows/90a302fbee3e4bef8d2a0ff5954e6093/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=R_kKpbcUVfu9iiXwnMCwqu_yw8WzOEVz1GUJ1tfrpvY", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedData),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to save changes");
      }
  
      // Log success message and reset state
      console.log("Changes saved successfully");
      setEditIndex(null);
      setEditedFields({});
  
      // After saving changes, fetch meeting details again to update the state
      fetchData();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };
  
  

  return (
    <div className="App" style={{ marginTop: "40px", marginRight: "60px" }}>
      {error ? (
        <p style={{ marginLeft: "80px", color: "red", fontSize: "16px" }}>
          {error}
        </p>
      ) : loading ? (
        <>
          <div className="spinner-border text-primary spinner" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p></p>
        </>
      ) : (
        <>
          <h6
            className="heading"
            style={{
              marginLeft: "350px",
              marginTop: "20px",
              width: "520px",
              fontSize: "35px",
            }}
          >
            {/* Project Instruction - ( England ) */}
            {/* Get from */}
            {/* {chatid} */}
            {/* Flow_GetInstructionProjectIDFromChatID */}
          </h6>
          <h5 style={{ marginLeft: "450px", marginTop: "20px", width: "520px", fontSize:"35px" }}>Annuities</h5>
          <div
            style={{ marginLeft: "448px", marginTop: "20px", width: "53.5%" }}
          >
            <div className="card-container">
              {Array.isArray(instructionType) && instructionType.length > 0 ? (
                instructionType.map((instruction, index) => (
                  <div key={index} className="card">
                    <h3>Name: {instruction.Name}</h3>
                    <p>Primary Category: {instruction.PrimaryCategory}</p>
                    <p>Jurisdiction: {instruction.Jurisdiction}</p>
                    <p>AnnuityID: {instruction.AnnuityID}</p>
                    {editIndex === index ? (
                      <>
                        <label>PayTerm:</label>
                        <input
                          type="text"
                          value={editedFields["PayTerm"] || instruction.PayTerm}
                          onChange={(e) => handleInputChange(e, "PayTerm")}
                        />
                        <br />
                        <label>PayYear:</label>
                        <input
                          type="text"
                          value={editedFields["PayYear"] || instruction.PayYear}
                          onChange={(e) => handleInputChange(e, "PayYear")}
                        />
                        <br />
                        <button onClick={handleSaveChanges}>Save</button>
                      </>
                    ) : (
                      <>
                        <p>PayTerm: {instruction.PayTerm}</p>
                        <p>PayYear: {instruction.PayYear}</p>
                        {/* Add more properties as needed */}
                      </>
                    )}
                    <Link className="link">
                      <Edit onClick={() => handleEditClick(index)} />
                    </Link>
                  </div>
                ))
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Anuuities;
