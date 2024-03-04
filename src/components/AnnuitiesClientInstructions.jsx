import React, { useState, useEffect } from "react";
import "./App.css";
import AddAnnuities from "./AddAnnuities";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  Edit,
  Link2,
  RefreshCcw,
} from "react-feather"; // Import RefreshCcw icon
import { Modal } from "react-bootstrap";
import EditAnnuities from "./EditAnnuities";
import "./App.css";

const AnnuitiesClientInstructions = () => {
  const [loading, setLoading] = useState(false); // Set initial loading state to false
  const [flowData, setFlowData] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null); // Maintain fetched data separately
  const [details, setDetails] = useState({});

  const handleAddEntry = (newEntry) => {
    console.log("New entry   received:", newEntry);

    // Ensure newEntry is not an empty object before updating state
    if (Object.keys(newEntry).length > 0) {
      setFlowData((prevFlowData) => [...prevFlowData, newEntry]);
    }
  };

 // Filter flowData based on search query
const filteredFlowData =
flowData &&
flowData.filter((item) =>
  item.Name && item.Name.toLowerCase().includes(searchQuery.toLowerCase())
);
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
    setShowEditModal(false);
  };

  useEffect(() => {
    fetch('https://prod-156.westus.logic.azure.com:443/workflows/81462bc99b184115b59100fcd6e15813/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=sy3M2pZxs1ZtVRI9PuUJ2J-gz6Xo4ov4NhGAwuIXu_Q')
      .then(response => response.json())
      .then(data => setDetails(data))
      .catch(error => console.error('Error fetching details:', error));
  }, []);

  // // Handle refreshing data
  // const handleRefresh = () => {
  //   fetchData();
  // };

  const formatDate = (date) => {
    const year = date.getFullYear();
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day; // Add leading zero if needed
    let month = date.getMonth() + 1; // Months are zero-indexed
    month = month < 10 ? `0${month}` : month; // Add leading zero if needed
    return `${month}/${day}/${year}`;
  };

  return (
    <>
{/* <TabAddAnnuities onAddEntry={handleAddEntry}/> */}
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
      <div className="hding">
         <div>
            <Table className="table-border table-striped table-hover annuities-client-inx">
              <Thead>
                <Tr>
                  <Th>_hip_clientinstructionproject_value</Th>
                  <Th>Ref.No</Th>
                  <Th>MatterType</Th>
                  <Th>Title</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFlowData.map((item, index) => (
                  <Tr key={index}>
                    <Td>clientinstructionproject_value : {details._hip_clientinstructionproject_value}</Td>
                    <Td>Ref. No: {details['Ref.No']}</Td>
                    <Td>Matter Type: {details.MatterType}</Td>
                    <Td>Title: {details.Title}</Td>
        <Td>
          <Link2
            className="itemlink"
            size="22px"
            color="#5b5fc7"
            cursor="pointer"
            onClick={() => {
              window.location.href = item.ItemLink;
              const iframe = document.createElement('iframe');
              iframe.src = item.ItemLink;
              iframe.style.position = 'fixed';
              iframe.style.top = '50%';
              iframe.style.left = '50%';
              iframe.style.width = '90vw';
              iframe.style.height = '90vh';
              iframe.style.border = 'none';
              iframe.style.transform = 'translate(-50%, -50%)';
              document.body.appendChild(iframe);
              // Create close button using FontAwesome icon
              const closeButton = document.createElement('div');
              closeButton.innerHTML = '<FontAwesomeIcon icon={faTimes} />';
              closeButton.style.position = 'fixed';
              closeButton.style.top = '10px';
              closeButton.style.right = '10px';
              closeButton.style.cursor = 'pointer';
              closeButton.addEventListener('click', () => {
                document.body.removeChild(iframe);
                document.body.removeChild(closeButton);
              });
              document.body.appendChild(closeButton);
            }}
          />
        </Td>
        <Td>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Edit
              className="itemlink"
              color="#5b5fc7"
              style={{ cursor: "pointer", marginRight: "18px" }}
              onClick={() => handleEditEntry(item)}
            />
          </div>
        </Td>
      </Tr>
    ))}
  </Tbody>
</Table>
          </div>
      
        {/* Edit Modal */}
        <Modal
          show={showEditModal}
          onHide={handleCloseEditModal}
          className="modelpopup"
          dialogClassName="modal-dialog modal-dialog-centered modal-lg"
        >
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
    </>
  );
};

export default AnnuitiesClientInstructions;
