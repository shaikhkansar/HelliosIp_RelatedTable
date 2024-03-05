// 2nd Table  heading (Annuities for the above Instruction Type)

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./App.css";
import Data  from "./Data.json";

const Anuuities = ({ chatid }) => {
  const [instructionType, setInstructionType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const encodeddata = encodeURIComponent(chatid);
        const modifiedEncodedData = encodeddata.replace(/%3A/g, "%3a");

        const response = await fetch(
          Data[1].url,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chatid: modifiedEncodedData,
            }),
          }
        );

        // if (response.status !== 200) {
        //   setError("This meeting is not compatible for this App !!!");
        //   throw new Error("This meeting is not compatible for this App !!!");
        // }

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
          {/* <h5 style={{ marginLeft: "350px", marginTop: "20px", width: "520px", fontSize:"35px" }}>List of Annuities</h5> */}
          <div
            style={{ marginLeft: "448px", marginTop: "20px", width: "53.5%" }}
          >
            <Tr>
              <Td>
                {" "}
                <p
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                  className="hdng"
                >
                  Annuities Instruction Type
                </p>
              </Td>
            </Tr>
            {Array.isArray(instructionType) && instructionType.length > 0 ? (
              
              <Table className=" SuperResponsiveTable table-striped table table-hover">
                <Thead>
                  <Tr>
                    {Object.keys(instructionType[0]).map((property) => (
                      <Th key={property} className="thTdStyle">
                        {property}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {instructionType.map((instruction, index) => (
                    <Tr key={index}>
                      {Object.values(instruction).map((value, valueIndex) => {
                        console.log("Value:", value); // Add this line for debugging
                        return (
                          <Td key={valueIndex} className="thTdStyle2">
                            {valueIndex === 0 ? (
                              <Link
                                style={{ textDecoration: "none" }}
                                to={{
                                  pathname: "/annuities-client-instruction",
                                }}
                              >
                                <div>{value}</div>{" "}
                              </Link>
                            ) : (
                              <div>
                                {typeof value === 'string' ? value.split(" ").join("\n") : ""}
                              </div>
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Anuuities;
