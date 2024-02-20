import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddAnnuities from "./AddAnnuities";
import { Edit, SkipBack, Search, Link2, RefreshCcw,XCircle } from "react-feather"; // Import RefreshCcw icon
// import DeleteAnnuities from "./DeleteAnnuities";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import "./App.css";
import EditAnnuities from "./EditAnnuities";
import { Modal } from "react-bootstrap";
import ReactDOM from 'react-dom';

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
      "https://prod-02.centralindia.logic.azure.com:443/workflows/1cfbd3f3025940db835c4a5c4a605851/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5rDfrxdePF7I7iRML_s-zv4MAA-Axl--BcobJtqjUvQ";

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
  // const handleDeleteEntry = (entryId) => {
  //   setFlowData((prevFlowData) =>
  //     prevFlowData.filter((entry) => entry.ClientInstructionID !== entryId)
  //   );
  // };

  // Handle refreshing data
  const handleRefresh = () => {
    fetchData();
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
              <Thead style={{fontSize:"12px"}}>
                <Tr>
                  <Th>Name</Th>
                  <Th>Jurisdiction</Th>
                  <Th>Instruction Date</Th>
                  <Th>Annuities DueDate</Th>
                  <Th>Item Link</Th>
                  <Th>Action</Th>
                  <Th>Annuities Id 
        <RefreshCcw onClick={handleRefresh} className="refresh-button" />
     </Th>
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
  className="itemlink"
    size="22px"
    color="#5b5fc7"
    cursor="pointer"
    onClick={() => {
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = item.ItemLink;
      iframe.style.position = 'fixed';
      iframe.style.top = '50%';
      iframe.style.left = '50%';
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      iframe.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(iframe);

      // Create close button using React Feather icon
      const closeButton = document.createElement('div');
      closeButton.style.position = 'fixed';
      closeButton.style.top = '2px';
      closeButton.style.right = '10px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.zIndex = '9999'; // Ensure it's above other elements
      closeButton.style.marginLeft = '-30px'; // Add margin-left
      closeButton.addEventListener('click', () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeButton);
      });

      // Render React Feather close icon inside closeButton div
      ReactDOM.render(<XCircle size={24} color="white" />, closeButton);

      document.body.appendChild(closeButton);
    }}
  />
</Td>
                    <Td>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Edit
                        className="itemlink"
                          color="#5b5fc7"
                          onClick={() => handleEditEntry(item)} // Open edit modal
                          style={{ cursor: "pointer", marginRight: "18px" }}
                        />
                       
                      </div>
                    </Td>
                    <Td>  {/* <DeleteAnnuities */}
                          {/* key={item.ClientInstructionID} */}
                          entryId={item.ClientInstructionID}
                          {/* onDeleteEntry={handleDeleteEntry} */}
                        {/* /> */}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal} className="modelpopup" dialogClassName="modal-dialog modal-dialog-centered modal-lg">
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