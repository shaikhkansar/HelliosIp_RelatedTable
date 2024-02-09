import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddAnnuities from "./AddAnnuities";
import { Edit, SkipBack, Search, Link2 } from "react-feather";
import DeleteAnnuities from "./DeleteAnnuities";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./App.css";
import EditAnnuities from "./EditAnnuities";
import { Modal } from "react-bootstrap";

const AnnuitiesClientInstruction = () => {
  const [flowData, setFlowData] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddEntry = (newEntry) => {
    console.log("New entry received:", newEntry);

    // Ensure newEntry is not an empty object before updating state
    if (Object.keys(newEntry).length > 0) {
      setFlowData((prevFlowData) => [...prevFlowData, newEntry]);
    }
  };

  // Fetch data function
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

  // Initial data fetch on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Handle edit entry
  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedEntry(null);
    setShowEditModal(false);
  };

  // Handle edit success
  const handleEditSuccess = (updatedEntry) => {
    setFlowData((prevFlowData) =>
      prevFlowData.map((entry) =>
        entry.ClientInstructionID === updatedEntry.ClientInstructionID
          ? updatedEntry
          : entry
      )
    );
    setSelectedEntry(null);
  };

  // Handle delete entry
  const handleDeleteEntry = (entryId) => {
    setFlowData((prevFlowData) =>
      prevFlowData.filter((entry) => entry.ClientInstructionID !== entryId)
    );
  };

// Filter flowData based on search query
const filteredFlowData = flowData && flowData.filter((item) =>
  item.Name.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div>
      <AddAnnuities onAddEntry={handleAddEntry} />

      <div className="handle-search">
        <div className="search-icon">
          {/* <Search /> */}
        </div>
        <input
          type="text"
          className="form-control search-control"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div style={{marginTop:"20px"}}>
      {filteredFlowData &&(
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
              {filteredFlowData.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.Name}</Td>
                    <Td>{item.Jurisdiction}</Td>
                    <Td>
                      {new Date(item.InstructionDate).toLocaleDateString()}
                    </Td>
                    <Td>
                      {new Date(item.AnnuitiesDueDate).toLocaleDateString()}
                    </Td>
                    <Td>
                      <Link2
                        size="22px"
                        color="#5b5fc7"
                        cursor="pointer"
                        onClick={() => {
                          window.location.href = item.ItemLink;
                        }}
                      />
                    </Td>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Edit
                          color="#5b5fc7"
                          onClick={() => handleEditEntry(item)} // Open edit modal
                          style={{ cursor: "pointer", marginRight: "18px" }}
                        />
                        <DeleteAnnuities
                          key={item.ClientInstructionID}
                          entryId={item.ClientInstructionID}
                          onDeleteEntry={handleDeleteEntry}
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Entry</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <EditAnnuities
                  entry={selectedEntry}
                  onClose={handleCloseEditModal}
                  onEdit={handleEditSuccess}
                />
              </Modal.Body>
            </Modal>
          </div>
        )}
      </div>
      {/* {selectedEntry && (
        <EditAnnuities
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onEdit={handleEditSuccess}
        />
      )} */}
    </div>
  );
};

export default AnnuitiesClientInstruction;