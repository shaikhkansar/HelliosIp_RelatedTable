import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dynamics365Entity from "./Dynamics365Entity";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import InstructionProject from "./InstructionProject";
import "./App.css"

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
          "https://prod-02.centralindia.logic.azure.com:443/workflows/68997dc6b9fb4f0ebd112781ead4642e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=St2jazQAvlmJ6aVdRNX_ndjucJFGzCwA2xOwluOULpQ",
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
          setError("Error fetching meeting details");
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
        // <div className="spinner-border text-primary spinner" role="status">
        //   <span className="visually-hidden">Loading...</span>
        // </div>
        <p></p>
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
                <p style={{fontSize:"18px", fontWeight:"bold"}}>Annuities for the above Instruction Type</p>
              </Td>
            </Tr>
            <Table className="table-striped">
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
                    {Object.values(instruction).map((value, valueIndex) => (
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
                          <div>{value.split(" ").join("\n")}</div>
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default Anuuities;
