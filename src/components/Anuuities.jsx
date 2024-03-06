import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import Data from "./Data.json";
import EditAnnuities from "./EditAnnuities"; // Import the EditAnnuities component
import { Edit } from "react-feather";

const Anuuities = ({ chatid }) => {
  const [instructionType, setInstructionType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the item being edited

  useEffect(() => {
    let isMounted = true;

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

        const data = await response.json();

        if (isMounted) {
          setInstructionType(data);
          setError(null);
          setLoading(false);
        }

        console.log("Meeting details:", data.value);
      } catch (error) {
        if (isMounted) {
          setError(`Error fetching meeting details: ${error.message}`);
          setLoading(false);
        }
        console.error("Error fetching meeting details", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [chatid]);

  const handleEditClick = (index) => {
    setEditIndex(index);
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
                    <p>PayTerm: {instruction.PayTerm}</p>
                    <p>PayYear: {instruction.PayYear}</p>
                    {/* Add more properties as needed */}
                    {editIndex === index ? ( // Render EditAnnuities component if index matches the editing index
                    <EditAnnuities />
                    ) : (
                      <Link className="link">
                        <Edit onClick={() => handleEditClick(index)}/>
                      </Link>
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
