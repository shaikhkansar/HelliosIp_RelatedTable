import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Data from "./Data.json";
import { Edit, XSquare, Save } from "react-feather";

const Anuuities = ({ chatid }) => {
  const [instructionType, setInstructionType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the item being edited
  const [editedFields, setEditedFields] = useState({});
  const [showAnnuities, setShowAnnuities] = useState(true); // State to toggle between Annuities and Test heading

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
        throw new Error(
          `Failed to fetch meeting details (status ${response.status})`
        );
      }

      const responseData = await response.json();

      if (!Array.isArray(responseData) || responseData.length === 0) {
        throw new Error("Meeting details not found");
      }

      setInstructionType(responseData);
      console.log("Updated instructionType:", responseData);
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
    setShowAnnuities(false); // Hide the heading when edit button is clicked
  };

  const handleInputChange = (e, key) => {
    setEditedFields({
      ...editedFields,
      [key]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      if (
        !instructionType ||
        editIndex === null ||
        editIndex < 0 ||
        editIndex >= instructionType.length
      ) {
        throw new Error("Invalid data to save changes");
      }
      // Get the hip_annuity value for the current editIndex
      const annuityID = instructionType[editIndex]?.AnnuityID;

      if (!annuityID) {
        throw new Error("AnnuityID value not found");
      }
      // Construct the payload with the edited fields and hip_annuity
      const editedData = {
        hip_annuity: annuityID,
        Instructions:
          editedFields["Instructions"] ||
          instructionType[editIndex].Instructions,
        Comments:
          editedFields["Comments"] || instructionType[editIndex].Comments,
      };

      console.log("editedData", editedData);

      // Make a POST request to the endpoint with the payload
      const response = await fetch(
        "https://prod-143.westus.logic.azure.com:443/workflows/90a302fbee3e4bef8d2a0ff5954e6093/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=R_kKpbcUVfu9iiXwnMCwqu_yw8WzOEVz1GUJ1tfrpvY",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedData),
        }
      );

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
          {showAnnuities && (
            <h5
              style={{
                marginLeft: "450px",
                marginTop: "20px",
                width: "520px",
                fontSize: "35px",
              }}
            >
              Annuities
            </h5>
          )}
          <div
            style={{ marginLeft: "448px", marginTop: "20px", width: "53.5%" }}
          >
            <div className="card-container">
              {Array.isArray(instructionType) && instructionType.length > 0 ? (
                instructionType.map((instruction, index) => (
                  <div key={index} className="card">
                    {editIndex !== null && editIndex !== index ? null : (
                      <>
                        <h3>Name: {instruction.Name}</h3>
                        <p>Primary Category: {instruction.PrimaryCategory}</p>
                        <p>AnnuityID: {instruction.AnnuityID}</p>
                        <p>Annuity Due-Date: {instruction.AnnuityDueDate}</p>
                        <p>
                          Standing Instructions:{" "}
                          {instruction.StandingInstructions}
                        </p>
                        <p>Total Fees (Base): {instruction.TotalFees}</p>
                        <p>AnnuityID: {instruction.AnnuityID}</p>
                        {editIndex === index ? (
                          <>
                            <label>Instructions:</label>
                            <select
                              className="form-control"
                              value={
                                editedFields["Instructions"] ||
                                instruction.Instructions
                              }
                              onChange={(e) =>
                                handleInputChange(e, "Instructions")
                              }
                            >
                              <option value="1">--Select--</option>
                              <option value="2">Pay</option>
                              <option value="3">Pay in Grace Period</option>
                              <option value="4">Hold for Instructions</option>
                              <option value="5">Do Not Pay</option>
                              <option value="6">Pay Others Channel</option>
                              <option value="7">Paid with Parent</option>
                            </select>
                            <br />
                            <label>Comments:</label>
                            <textarea
                              className="form-control"
                              
                              value={
                                editedFields["Comments"] ??
                                instructionType[index]
                                  ?.Comments
                              }
                              onChange={(e) => handleInputChange(e, "Comments")}
                            />
                            <br />
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <span style={{ marginRight: "5px" }}>Save</span>
                              <Save
                                style={{
                                  color: "#5b5fc7",
                                  marginRight: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={handleSaveChanges}
                              />
                              <span style={{ marginRight: "5px" }}>Cancel</span>
                              <XSquare
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={() => {
                                  setEditIndex(null);
                                  setShowAnnuities(true); // Show the heading when cancel button is clicked
                                  setEditedFields({});
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <p>Instructions: {instruction.Instructions}</p>
                            <p>Comments: {instruction.ClientInstructionComments}</p>
                            {/* Add more properties as needed */}
                            <Link className="link">
                              <Edit
                                style={{ color: "#5b5fc7", marginRight: "5px" }}
                                onClick={() => handleEditClick(index)}
                              />
                            </Link>
                          </>
                        )}
                      </>
                    )}
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
