import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Data from "./Data.json";
import { Edit, XSquare, Save } from "react-feather";
import PatentsForAnnuities from "./PatentForAnnuities";

const Anuuities = ({ chatid }) => {
  const [instructionType, setInstructionType] = useState(null);
  console.log("responseData instruction type", instructionType);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the item being edited
  const [editedFields, setEditedFields] = useState({});
  const [showAnnuities, setShowAnnuities] = useState(true); // State to toggle between Annuities and Test heading
  const [annuityID, setAnnuityID] = useState(null);
  const [showAnnuityID, setShowAnnuityID] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false); // State to control spinner visibility

  console.log("showAnnuityID:", showAnnuityID);

  const fetchData = async () => {
    try {
      setLoading(true); // Show the spinner
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
        if (response.status === 502) {
          // No need to display error for a 502 Bad Gateway status
          console.warn("Failed to fetch meeting details (status 502)");
          return;
        }
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
      setShowSpinner(false); // Hide the spinner

      console.log("Meeting details:", responseData);
    } catch (error) {
      setError(`Error fetching meeting details: ${error.message}`);
      setLoading(false);
      setShowSpinner(false); // Hide the spinner
      console.error("Error fetching meeting details", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [chatid]);

  const handleEditClick = (index) => {
    setEditIndex(index);
    setShowAnnuities(false); // Hide the heading when edit button is clicked
    // Set the old value of Comments
    setAnnuityID(instructionType[index]?.AnnuityID);
    setEditedFields({
      ...editedFields,
      Comments: instructionType[index]?.ClientInstructionComments || "", // Use the current value or empty string if not available
    });
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

      // Show the spinner
      setShowSpinner(true);

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
  const optionMapping = {
    "910310000": "Pay",
    "846440001": "Pay in Grace Period",
    "846440002": "Hold for Instructions",
    "910310003": "Do Not Pay",
    "591930001": "Pay Others Channel",
    "910310001": "Paid with Parent"
    // add more values if required
  };
  const getTextFormat = (value) => {
    return optionMapping[value] || "";
  };
  
  console.log("Rendering paragraphs. showAnnuityID:", showAnnuityID);
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
            <p
              style={{
                marginLeft: "450px",
                marginTop: "20px",
                width: "520px",
                fontSize: "20px",
              }}
            >
              Annuities
            </p>
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
                        {/* <p>Primary Category: {instruction.PrimaryCategory}</p> */}
                        {/* <p className={showAnnuityID ? "" : "hidden"}>
                          AnnuityID: {instruction.AnnuityID}
                        </p> */}
                        <p>Annuity Due-Date: {instruction.AnnuityDueDate}</p>
                        {/* <p>
                          Standing Instructions:{" "}
                          {instruction.StandingInstructions}
                        </p>
                        <p>Total Fees (Base): {instruction.TotalFees}</p> */}
                        {editIndex === index ? (
                          <>
                            <label>Instructions:</label>
                            <select
                              className="form-control"
                              value={
                                editedFields["Instructions"] !== undefined
                                  ? editedFields["Instructions"]
                                  : instruction.Instructions
                              }
                              onChange={(e) =>
                                handleInputChange(e, "Instructions")
                              }
                            >
                              <option value="0">--Select--</option>
                              <option value="910310000">Pay</option>
                              <option value="846440001">
                                Pay in Grace Period
                              </option>
                              <option value="846440002">
                                Hold for Instructions
                              </option>
                              <option value="910310003">Do Not Pay</option>
                              <option value="591930001">
                                Pay Others Channel
                              </option>
                              <option value="910310001">
                                Paid with Parent
                              </option>
                            </select>

                            <br />
                            <label>Comments:</label>
                            <textarea
                              className="form-control"
                              value={
                                editedFields["Comments"] ??
                                instructionType[index]?.Comments
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
                            <p>Instructions: {getTextFormat(instruction.Instructions)}</p>
                            <p>
                              Comments: {instruction.ClientInstructionComments}
                            </p>
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
          {/* {annuityID && <PatentsForAnnuities annuityID={annuityID} />} */}
          {showSpinner && (
            <div className="spinner-border text-primary spinner" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Anuuities;
