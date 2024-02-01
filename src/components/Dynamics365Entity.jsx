import React, { useState, useEffect, useReducer } from "react";
import { Edit, Link2, Search } from "react-feather";
import EditEmployee from "./EditEmployee";
import DeleteEmployee from "./DeleteEmployee";
import AddEmployee from "./AddEmployee";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const Dynamics365Entity = () => {
  const [error, setError] = useState(null);
  const [instructionData, setInstructionData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [users, setUsers] = useState([]);
  const [editedUsers, setEditedUsers] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [formData, setFormData] = useState({
    Name: "",
    Jurisdiction: "",
    InstructionDate: "",
    AnnuitiesDueDate: "",
  });
  const [forceRender, setForceRender] = useState(0);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const handleInputChange = (event, ClientInstructionID, field) => {
    const value = event.target.value;

    setEditedUsers((prevEditedUsers) => {
      const updatedUsers = { ...prevEditedUsers };
      const editedUser = updatedUsers[ClientInstructionID] || {
        isEditing: true,
        data: {},
      };
      editedUser.data = {
        ...editedUser.data,
        [field]: value,
      };
      updatedUsers[ClientInstructionID] = editedUser;
      return updatedUsers;
    });
  };

  const handleEdit = (instructionId) => {
    setEditedUsers((prevEditedUsers) => {
      const updatedUsers = { ...prevEditedUsers };
      const editedUser = updatedUsers[instructionId] || {
        isEditing: true,
        data: { ...instructionData.find((instruction) => instruction.ClientInstructionID === instructionId) },
      };
      updatedUsers[instructionId] = editedUser;
      return updatedUsers;
    });
    setEditMode(instructionId);
    const instructionToEdit = instructionData.find(
      (instruction) => instruction.ClientInstructionID === instructionId
    );
    setEditedData(instructionToEdit || {});
  };
  

  const handleSave = async (ClientInstructionID) => {
    try {
      const editedUser = editedUsers[ClientInstructionID];

      if (!editedUser || !editedUser.isEditing || !editedUser.data) {
        console.error("Invalid edit state");
        return;
      }

      const response = await fetch(
        "https://prod-09.centralindia.logic.azure.com:443/workflows/53cbed9ffcb64ada93f3093559b26ce4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0SmgrwmyywrGfWZFpkj4DfRlxWJhb7S4JgUG_I-Z0UI",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ClientInstructionID: ClientInstructionID,
            Name: editedUser.data.Name,
            Jurisdiction: editedUser.data.Jurisdiction,
            InstructionDate: editedUser.data.InstructionDate,
            AnnuitiesDueDate: editedUser.data.AnnuitiesDueDate,
          }),
        }
      );

      if (response.ok) {
        console.log("Edit request successful!");

        // Remove the edited user from the state
        setEditedUsers((prevEditedUsers) => {
          const updatedUsers = { ...prevEditedUsers };
          delete updatedUsers[ClientInstructionID];
          return updatedUsers;
        });

        // Fetch updated data from the server
        fetchData();
      } else {
        console.log("API error:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    console.log("Edited users updated:", editedUsers, users);
    // Add any additional logic to update the UI as needed
  }, [editedUsers, users]);

  const handleCancel = (ClientInstructionID) => {
    setEditedUsers((prevEditedUsers) => {
      const { [ClientInstructionID]: _, ...updatedUsers } = prevEditedUsers;
      return updatedUsers;
    });
    setEditMode(null);
  };
  const updateUsers = (newUserData) => {
    console.log("Received data:", newUserData); // Log the received data
    setUsers([...users, newUserData]); // Update the state properly
  };

  const handleAdd = () => {
    const newUser = { ...formData, ItemLink: formData.ItemLink || "" };
    setUsers((prevUsers) => [...prevUsers, newUser]);
    setFormData({
      Name: "",
      Jurisdiction: "",
      InstructionDate: "",
      AnnuitiesDueDate: "",
    });
  };

  const handleDelete = async (ClientInstructionID) => {
    try {
      const deleteFlowUrl =
        "https://prod-04.centralindia.logic.azure.com:443/workflows/eb2d5f1519ee42a0900fb152b5c29dec/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=j96FxDnEJaX_-8cWon-p2tTtWdU81EgaHGFWUc2U7LU";

      const requestBody = {
        AnnuitiesClientInstructionID: ClientInstructionID,
      };

      const response = await fetch(deleteFlowUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("Instruction deleted successfully.");

        // Update the state with the latest data from the server
        setEditedUsers((prevEditedUsers) => {
          const updatedUsers = { ...prevEditedUsers };
          delete updatedUsers[ClientInstructionID];
          return updatedUsers;
        });
      } else {
        console.log("API error:", response);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // useEffect(() => {
  //   console.log("Calling fetchData...");
  // }, []);

  const fetchData = async () => {
    try {
      const url =
        "https://prod-31.centralindia.logic.azure.com:443/workflows/b099fe3a64ed4c2b980dba7badc2c13b/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=KTxIadchgbpo8oEKAzIe48KGgEmEpW4NRTXAOnFd-g0";

      const requestBody = {
        _crea6_annuities_value: "3ce79961-75bb-ee11-9079-0022486e6d69",
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Received data:", data);

      if (Array.isArray(data) && data.length > 0) {
        console.log("Setting instruction data:", data);
        setInstructionData(data);
        setIsLoaded(true);
      } else {
        console.error("Invalid data format:", data);
        setError("Invalid data format");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = Array.isArray(instructionData)
    ? instructionData
        .map((user) => ({
          Name: user.Name,
          Jurisdiction: user.Jurisdiction,
          InstructionDate: user.InstructionDate,
          AnnuitiesDueDate: user.AnnuitiesDueDate,
        }))
        .filter((user) => {
          const searchString = [
            String(user.ClientInstructionID),
            user.Name,
            user.Jurisdiction,
            user.InstructionDate,
            user.AnnuitiesDueDate,
          ]
            .join(" ")
            .toLowerCase();

          const searchQueryLower = searchQuery.toLowerCase();

          if (searchQuery.length === 1 && /^\d$/.test(searchQueryLower)) {
            // If the search query is a single digit, allow searching for a single-digit Employee ID
            return String(user.ClientInstructionID).includes(searchQueryLower);
          }

          // Otherwise, perform the standard search
          return searchString.includes(searchQueryLower);
        })
    : [];

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div></div>;
  } else {
    return (
      <>
        <h4>Instruction Project - (London Times)</h4>
        <AddEmployee
          deleteSuccess={deleteSuccess}
          saveSuccess={saveSuccess}
          updateUsers={updateUsers}
          users={users}
          fetchData={fetchData}
        />
        <div className="search-container">
          <div className="search-input">
            <div className="handle-search">
              <div className="search-icon">
                <Search />
              </div>
              <input
                type="text"
                className="form-control search-control"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="results-container">
            <Table className="table table-hover table-container">
              <Thead>
                <Tr className="sticky-header">
                  <Th>Name</Th>
                  <Th>Jurisdiction</Th>
                  <Th>Instruction date</Th>
                  <Th>Annuities Due-date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.ClientInstructionID} className="user-td">
                    {[
                      "Name",
                      "Jurisdiction",
                      "InstructionDate",
                      "AnnuitiesDueDate",
                    ].map((field) => (
                      <Td key={field}>
                        {editedUsers[user.ClientInstructionID]?.isEditing ? (
                          <input
                            placeholder={field}
                            className="form-control edit-input"
                            type="text"
                            value={
                              editedUsers[user.ClientInstructionID]?.data?.[
                                field
                              ] || user[field]
                            }
                            onChange={(event) =>
                              handleInputChange(
                                event,
                                user.ClientInstructionID,
                                field
                              )
                            }
                          />
                        ) : (
                          user[field]
                        )}
                      </Td>
                    ))}
                    <Td>
                      <div className="edit-icons-container">
                        {editedUsers[user.ClientInstructionID]?.isEditing ? (
                          <EditEmployee
                            user={user}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            handleInputChange={handleInputChange}
                            editedUsers={editedUsers}
                          />
                        ) : (
                          <>
                            <span
                              className=""
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Edit"
                            >
                              <Edit
                                size="20px"
                                cursor="pointer"
                                color="#5b5fc7"
                                onClick={() =>
                                  handleEdit(user.ClientInstructionID)
                                }
                                className="edit-icon"
                              />
                            </span>
                            <DeleteEmployee
                              user={user}
                              handleDelete={() =>
                                handleDelete(user.ClientInstructionID)
                              }
                            />
                          </>
                        )}
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
  }
};

export default Dynamics365Entity;
