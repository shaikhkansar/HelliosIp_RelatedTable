import React, { useState, useEffect } from "react";
import "./App.css";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Edit, Link2,} from "react-feather"; 
import "./App.css";

const AnnuitiesPatents = () => {
  const [loading, setLoading] = useState(false); 
  const [flowData, setFlowData] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null); 
  const [details, setDetails] = useState({});

  const handleAddEntry = (newEntry) => {
    console.log("New entry   received:", newEntry);

    if (Object.keys(newEntry).length > 0) {
      setFlowData((prevFlowData) => [...prevFlowData, newEntry]);
    }
  };

  const filteredFlowData =
    flowData &&
    flowData.filter(
      (item) =>
        item.Name && item.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedEntry(null);
    setShowEditModal(false);
  };

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
    fetch(
      "https://prod-156.westus.logic.azure.com:443/workflows/81462bc99b184115b59100fcd6e15813/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=sy3M2pZxs1ZtVRI9PuUJ2J-gz6Xo4ov4NhGAwuIXu_Q"
    )
      .then((response) => response.json())
      .then((data) => setDetails(data))
      .catch((error) => console.error("Error fetching details:", error));
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day; 
    let month = date.getMonth() + 1; 
    month = month < 10 ? `0${month}` : month; 
    return `${month}/${day}/${year}`;
  };

  return (
    <>
      <div className="handle-search">
        <div className="search-icon"></div>
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
                  <Td>
                    clientinstructionproject_value :{" "}
                    {details._hip_clientinstructionproject_value}
                  </Td>
                  <Td>Ref. No: {details["Ref.No"]}</Td>
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
                        const iframe = document.createElement("iframe");
                        iframe.src = item.ItemLink;
                        iframe.style.position = "fixed";
                        iframe.style.top = "50%";
                        iframe.style.left = "50%";
                        iframe.style.width = "90vw";
                        iframe.style.height = "90vh";
                        iframe.style.border = "none";
                        iframe.style.transform = "translate(-50%, -50%)";
                        document.body.appendChild(iframe);
                        const closeButton = document.createElement("div");
                        closeButton.innerHTML =
                          "<FontAwesomeIcon icon={faTimes} />";
                        closeButton.style.position = "fixed";
                        closeButton.style.top = "10px";
                        closeButton.style.right = "10px";
                        closeButton.style.cursor = "pointer";
                        closeButton.addEventListener("click", () => {
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
      </div>
    </>
  );
};

export default AnnuitiesPatents;
