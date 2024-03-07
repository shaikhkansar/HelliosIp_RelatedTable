// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "./App.css";
// import Data from "./Data.json";
// import { Edit } from "react-feather";

// const EditAnnuities = ({ editIndex, editedFields, handleInputChange, handleSaveChanges }) => {
//   return (
//     <>
//     <h1>Edit Annuities</h1>
//       <label>PayTerm:</label>
//       <input
//         type="text"
//         value={editedFields["PayTerm"]}
//         onChange={(e) => handleInputChange(e, "PayTerm")}
//       />
//       <br />
//       <label>PayYear:</label>
//       <input
//         type="text"
//         value={editedFields["PayYear"]}
//         onChange={(e) => handleInputChange(e, "PayYear")}
//       />
//       <br />
//       <button onClick={handleSaveChanges}>Save</button>
//     </>
//   );
// };

// export default EditAnnuities;

// import React from "react";

// const EditAnnuities = ({
//     annuity,
//   handleSaveChanges,
  
// }) => {
//   return (
//     <div>
//       <>
//       <p>Name:</p>
//         <p>AnnuityID:</p>
//         <p>Primary Category:</p>
//         <p>Annuity Due-Date: </p>
//         <p>Standing Instructions:</p>
//         <p>Total Fees (Base):</p>
//       </>
//       <label>Instructions</label>
//       <input
//         className="form-control"
//         type="text"
//         // value={editedFields["PayTerm"] || ''}
//         // onChange={(e) => handleInputChange(e, "PayTerm")}
//       />
//       <br />
//       <label>Comments</label>
//       <input
//         className="form-control"
//         type="text"
//         // value={editedFields["PayYear"] || ''}
//         // onChange={(e) => handleInputChange(e, "PayYear")}
//       />
//       <br />
//       <button onClick={handleSaveChanges}>Save</button>
//     </div>
//   );
// };

// export default EditAnnuities;
