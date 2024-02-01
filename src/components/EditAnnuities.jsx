import React, { useState } from 'react';

const EditAnnuitiesComponent = ({ entry, onClose }) => {
  const [formData, setFormData] = useState({
    AnnuitiesClientInstructionID: entry?.ClientInstructionID || '',
    Name: entry?.Name || '',
    Jurisdiction: entry?.Jurisdiction || '',
    'Instruction Date': entry?.InstructionDate || '',
    'Annuities Due Date': entry?.AnnuitiesDueDate || '',
  });
  const [response, setResponse] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEditAnnuities = async () => {
    try {
      const response = await fetch(
        'https://prod-09.centralindia.logic.azure.com:443/workflows/53cbed9ffcb64ada93f3093559b26ce4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0SmgrwmyywrGfWZFpkj4DfRlxWJhb7S4JgUG_I-Z0UI',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any additional headers for authentication or other requirements
          },
          body: JSON.stringify(formData),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        setResponse(JSON.stringify(result, null, 2));
      } else {
        setResponse('Non-JSON response received');
      }
  
      // Close the modal or perform any other action after editing
      onClose();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  return (
    <div>
      <h3>Edit Annuities</h3>
     <label>
        Name:
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Jurisdiction:
        <input
          type="text"
          name="Jurisdiction"
          value={formData.Jurisdiction}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
  Instruction Date:
  <input
    type="date"
    name="Instruction Date"
    value={formData['Instruction Date'].split('T')[0]}
    onChange={(e) => handleInputChange({ name: 'Instruction Date', value: e.target.value })}
  />
</label>
<br />
<label>
  Annuities Due Date:
  <input
    type="date"
    name="Annuities Due Date"
    value={formData['Instruction Date'].split('T')[0]}
    onChange={(e) => handleInputChange({ name: 'Annuities Due Date', value: e.target.value })}
  />
</label>
      <br />
      <button onClick={handleEditAnnuities}>Save Changes</button>
      <button onClick={onClose}>Cancel</button>
      <pre>{response}</pre>
    </div>
  );
};

export default EditAnnuitiesComponent;
