import React, { useState,useEffect } from "react";
import { Save, XSquare, Edit } from "react-feather";

const EditAnnuities = ({ initialPayTerm, initialPayYear }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [payTerm, setPayTerm] = useState("");
  const [payYear, setPayYear] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Update state when initial values change
  useEffect(() => {
    setPayTerm(initialPayTerm);
    setPayYear(initialPayYear);
  }, [initialPayTerm, initialPayYear]);

  const handleSaveClick = () => {
    setIsEditing(false);
    // Format the payYear date to "dd/MM/yyyy" before sending
    const formattedPayYear = formatDate(payYear);
  
    // Prepare data to send
    const data = {
      payTerm: payTerm,
      payYear: formattedPayYear
    };
  
    // Send POST request to the endpoint
    fetch('https://prod-143.westus.logic.azure.com:443/workflows/90a302fbee3e4bef8d2a0ff5954e6093/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=R_kKpbcUVfu9iiXwnMCwqu_yw8WzOEVz1GUJ1tfrpvY', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save entry');
      }
      // Check if response contains any content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Parse JSON response
        return response.json();
      } else {
        // No content in response, consider it a success
        setIsEditing(false);
        alert('Data saved successfully!');
        return null; // Return null to skip further processing
      }
    })
    .then(data => {
      if (data !== null) {
        // Handle successful response here if there's JSON data
        console.log('Entry saved successfully:', data);
      }
    })
    .catch(error => {
      // Handle error
      console.error('Error saving entry:', error);
      // Optionally, you can display an error message to the user
    });
  };
  
  

  const handleCancelClick = () => {
    // Handle canceling edit
    setIsEditing(false);
    // Reset input fields to initial values
    setPayTerm(initialPayTerm);
    setPayYear(initialPayYear);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return formattedDate;
  };

  return (
    <div>
    {isEditing ? (
      <div>
        <label htmlFor="payTerm">Pay Term:</label>
        <input
          className="form-control"
          type="text"
          id="payTerm"
          value={payTerm}
          onChange={(e) => setPayTerm(e.target.value)}
        />
        <br />
        <label htmlFor="payYear">Pay Year:</label>
        <input
          className="form-control"
          type="Date"
          id="payYear"
          value={payYear}
          onChange={(e) => setPayYear(e.target.value)}
        />
        <br />
        <Save onClick={handleSaveClick} />
        <XSquare onClick={handleCancelClick} />
      </div>
    ) : (
      <div>
        <Edit onClick={handleEditClick} />
      </div>
    )}
  </div>
  );
};

export default EditAnnuities;
