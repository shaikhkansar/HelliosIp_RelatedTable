import React, { useState } from "react";
import { Trash2 } from "react-feather";
const DeleteAnnuities = ({ entryId, onDeleteEntry }) => {
  const [response, setResponse] = useState(null);

  const handleDelete = async () => {
    try {
      const deleteFlowUrl =
        "https://prod-04.centralindia.logic.azure.com:443/workflows/eb2d5f1519ee42a0900fb152b5c29dec/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=j96FxDnEJaX_-8cWon-p2tTtWdU81EgaHGFWUc2U7LU";

      const requestBody = {
        AnnuitiesClientInstructionID: entryId,
      };

      const response = await fetch(deleteFlowUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Check if the response body is not empty before trying to parse JSON
        const responseBody = await response.text();
        if (responseBody.trim() !== "") {
          setResponse(JSON.parse(responseBody));
        }

        console.log("Instruction deleted successfully.");

        // Notify the parent component about the deletion
        onDeleteEntry(entryId);
      } else {
        console.error("Error deleting instruction:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting instruction:", error);
    }
  };

  return (
    <div>
     
        <Trash2 variant="danger" color="red" cursor="pointer" onClick={handleDelete}/>{" "}
     
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DeleteAnnuities;
