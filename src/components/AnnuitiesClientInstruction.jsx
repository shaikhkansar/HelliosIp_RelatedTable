import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddAnnuities from "./AddAnnuities";
import { Edit, SkipBack, Search, Link2 } from "react-feather";
import EditAnnuities from "./EditAnnuities";
import DeleteAnnuities from "./DeleteAnnuities";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./App.css";

const AnnuitiesClientInstruction = () => {
  const [flowData, setFlowData] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

 

    const fetchData = async () => {
      const apiUrl =
      "https://prod-31.centralindia.logic.azure.com:443/workflows/b099fe3a64ed4c2b980dba7badc2c13b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KTxIadchgbpo8oEKAzIe48KGgEmEpW4NRTXAOnFd-g0";
    

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _crea6_annuities_value: "5da82587-cec1-ee11-9079-0022486e6d69",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFlowData(data);
      } else {
        console.error("Failed to fetch data from Power Automate flow");
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Run once when the component mounts

  const handleAddEntry = (newEntry) => {
    console.log("New entry received:", newEntry);

    // Ensure newEntry is not an empty object before updating state
    if (Object.keys(newEntry).length > 0) {
      setFlowData((prevFlowData) => [...prevFlowData, newEntry]);
    }
  };

  const handleEditEntry = (entry) => {
    // Set the selected entry for editing
    setSelectedEntry(entry);
  };

  const handleEditSuccess = (updatedEntry) => {
    // Assuming flowData is an array of entries
    // Update the state instantly by mapping over the existing array
    setFlowData((prevFlowData) =>
      prevFlowData.map((entry) =>
        entry.ClientInstructionID === updatedEntry.ClientInstructionID
          ? updatedEntry // Update the specific entry
          : entry
      )
    );
    setSelectedEntry(null); // Reset the selected entry after editing
  };

  const handleEditModalClose = () => {
    // Reset the selected entry after editing is done or modal is closed
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (entryId) => {
    // Update the UI by removing the deleted entry from flowData
    setFlowData((prevFlowData) =>
      prevFlowData.filter((entry) => entry.ClientInstructionID !== entryId)
    );
  };
  // console.log("date format", flowData);

 

  return (
   
     <div>
        {/* <h3>Instruction Project - ( England )</h3> */}
        <AddAnnuities onAddEntry={handleAddEntry} />

        <div className="handle-search">
          <div className="search-icon">
            <Search />
          </div>
          <input
            type="text"
            className="form-control search-control"
            placeholder="Search"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          {flowData && (
            <div>
              <Table className="table-border table-striped  table table-hover annuities-client-inx">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Jurisdiction</Th>
                    <Th>Instruction Date</Th>
                    <Th>Annuities DueDate</Th>
                    <Th>Item Link</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {flowData.map((item, user) => (
                    <Tr key={item.ClientInstructionID}>
                      <Td>{item.Name}</Td>
                      <Td>{item.Jurisdiction}</Td>
                      <Td>
                        {new Date(item.InstructionDate).toLocaleDateString()}
                      </Td>
                      <Td>
                        {new Date(item.AnnuitiesDueDate).toLocaleDateString()}
                      </Td>
                      <Td>
                        <div className="link2-container">
                          <span
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Click to go to the Employee Details"
                          >
                           
                            <Link2
                              size="22px"
                              color="#5b5fc7"
                              onClick={() => {
                                window.location.href = user.ItemLink;
                              }}
                            />
                          </span>
                        </div>
                      
                      </Td>
                      <Td>
                        <Td>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Edit
                              color="#5b5fc7"
                              onClick={() => handleEditEntry(item)}
                              style={{ cursor: "pointer", marginRight: "18px" }}
                            />
                            <DeleteAnnuities
                              key={item.ClientInstructionID}
                              entryId={item.ClientInstructionID}
                              onDeleteEntry={handleDeleteEntry}
                            />
                          </div>
                        </Td>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </div>
          )}
        </div>
        {selectedEntry && (
          <EditAnnuities
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onEditSuccess={handleEditSuccess}
          />
        )}
      </div>
    
  );
};

export default AnnuitiesClientInstruction;
