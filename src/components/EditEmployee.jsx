import React from "react";
import { Save, XSquare } from "react-feather";

const EditEmployee = ({
  user,
  handleSave,
  handleCancel,
  handleInputChange,
  editedUsers,
}) => {
  const onSaveClick = async () => {
    try {
      await handleSave(user.ClientInstructionID);

      // Assuming handleSave updates the state, triggering a re-render
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  return (
    <>
      {/* Save button */}
      <div
        className=""
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Save"
        onClick={onSaveClick}
        style={{
          cursor: "pointer",
          marginRight: "25px",
          marginLeft: "-20px",
          marginTop: "3px",
        }}
      >
        <Save size="20px" color="#5b5fc7" />
      </div>

      {/* Cancel button */}
      <span
        className=""
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        title="Cancel"
        onClick={() => handleCancel(user.ClientInstructionID)}
        style={{ cursor: "pointer", marginRight: "8px", marginTop: "3px" }}
      >
        <XSquare size="20px" color="red" />
      </span>
    </>
  );
};

export default EditEmployee;



