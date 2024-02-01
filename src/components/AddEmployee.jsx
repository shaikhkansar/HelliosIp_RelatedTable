import { useState, useEffect } from "react";
import { UserPlus } from "react-feather";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddEmployee.css";

const AddEmployee = ({ deleteSuccess, saveSuccess, updateUsers, users }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Jurisdiction: "",
    InstructionDate: new Date(),
    AnnuitiesDueDate: new Date(),
  });

  const [formErrors, setFormErrors] = useState({
    Name: false,
    Jurisdiction: false,
    InstructionDate: false,
    AnnuitiesDueDate: false,
  });

  const [isPopup, setIsPopup] = useState(false);
  const [isDuplicatePopup, setIsDuplicatePopup] = useState(false);

  

  const handleDateChange = (date, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: date,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow empty string for deletion
    if (value === "") {
      handleChange(e); // Update state even if empty
      return;
    }

    // Check for valid characters in names
    if (name === "Jurisdiction" || name === "InstructionDate") {
      if (!/^[A-Za-z ]+$/.test(value)) {
        return;
      }
    }

    handleChange(e); // Update state
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Format dates before sending the request
    const formattedFormData = {
      ...formData,
      InstructionDate: formatDate(formData.InstructionDate),
      AnnuitiesDueDate: formatDate(formData.AnnuitiesDueDate),
    };
  
    // Function to format dates
    function formatDate(date) {
      const formattedDate = new Date(date);
      return (
        formattedDate.getMonth() +
        1 +
        "/" +
        formattedDate.getDate() +
        "/" +
        formattedDate.getFullYear()
      );
    }
  
    setFormData({
      Name: "",
      Jurisdiction: "",
      InstructionDate: null,
      AnnuitiesDueDate: null,
    });
  
    let hasErrors = false;
    const newFormErrors = { ...formErrors };
  
    for (const field in formattedFormData) {
      if (formattedFormData[field] === "") {
        newFormErrors[field] = true;
        hasErrors = true;
      } else {
        newFormErrors[field] = false;
      }
    }
  
    setFormErrors(newFormErrors);
  
    if (hasErrors) {
      return;
    }
  

    const userIdExists = users.some((user) => user.Name === formData.Name);

    if (userIdExists) {
      setIsDuplicatePopup(true);
      return; // Return without making the API call
    }

    try {
      const response = await fetch(
        "https://prod-12.centralindia.logic.azure.com:443/workflows/bc7faeecf9be472991c1fc22edf34600/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Cp2wPVLh-UjGXpxKgN4GH8QJUjkgyrfYnsMtPRzwNxw",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        
        if (response.status === 202) {
          // Request accepted, handle asynchronous processing
          console.log("Request accepted. Waiting for completion...");
          // Implement logic to check for completion (polling, webhooks, etc.)
        } else {
          const responseBody = await response.text();
          if (responseBody.trim() === "") {
            console.log("Empty response received.");
            // Handle the empty response if needed
          } else {
            try {
              const responseData = JSON.parse(responseBody);
              console.log("Received data:", responseData);
              updateUsers(responseData);
              setIsPopup(true);
              console.log("Request successful!");
            } catch (jsonError) {
              console.log("JSON parsing error:", jsonError);
            }
          }
        }
      } else {
        console.log("API error - Status Code:", response.status);
        const nonJsonResponse = await response.text();
        console.log("Non-JSON response:", nonJsonResponse);
      }
    } catch (error) {
      console.error("Network error:", error);
      console.log("Error message:", error.message);
    }
  };

  useEffect(() => {
    const clearPopup = () => {
      setIsPopup(false);
      setIsDuplicatePopup(false);
    };

    if (isPopup || isDuplicatePopup) {
      const timeout = setTimeout(clearPopup, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isPopup, isDuplicatePopup]);


  return (
    <>
      {isPopup && (
        <div
          className="alert alert-success g-3 successpopup"
          id="success-alert"
        >
          <strong>Success! </strong> User added successfully!
        </div>
      )}
      {isDuplicatePopup && (
        <div
          className="alert alert-danger g-3 successpopup"
          id="duplicate-alert"
        >
          <strong>Error: </strong> User ID already exists!
        </div>
      )}
      {deleteSuccess && (
        <div class="alert alert-danger g-3 successpopup" id="success-alert">
          <strong>Delete:</strong> Record deleted.
        </div>
      )}
      {saveSuccess && (
        <div class="alert alert-success g-3 successpopup" id="success-alert">
          <strong>Success! </strong> Employee saved successfully!
        </div>
      )}
      <div className="main-container">
        <form onSubmit={handleSubmit}>
          <div className="row mb-2">
            {["Name", "Jurisdiction","InstructionDate", "AnnuitiesDueDate" ].map(
              (field) => (
                <div key={field} className="col">
                  {field.includes("Date") ? (
                    <DatePicker
                      selected={formData[field]}
                      onChange={(date) => handleDateChange(date, field)}
                      className={`form-control ${
                        formErrors[field] ? "is-invalid" : ""
                      } form-control2`}
                      dateFormat="MM-dd-yyyy"
                    />
                  ) : (
                    <input
                      type="text"
                      className={`form-control ${
                        formErrors[field] ? "is-invalid" : ""
                      } form-control2`}
                      placeholder={field === "Name" ? "Name" : field}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                    />
                  )}
                  {formErrors[field] && (
                    <div className="invalid-feedback">
                      {`Please fill in ${
                        field === "Name" ? "User ID" : field
                      }`}
                    </div>
                  )}
                </div>
              )
            )}
            <div className="d-grid gap-2 col-6 d-flex justify-content-left">
              <button
                type="submit"
                className="btn btn-success"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Add Employees"
                onClick={handleSubmit}
              >
                <UserPlus />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );

}

export default AddEmployee;
