import './RegisterLoanModal.css';
import { useState } from 'react';
import { registerLoan } from '../../../services/loanService';

function RegisterLoanModal({ onClose }) {
  const [formData, setFormData] = useState({
    loan_reference_number: '',
    loan_start_date: '',
    tenure_in_months: '',
    emi_amount: '',
    total_money_taken: '',
    emi_date: '',
    loanDescription: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file') {
      if (files.length > 1) {
        alert('Please upload only one file');
        return;
      }

      const file = files[0];

      // ✅ Validate file type (PDF or image)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Only PDF or image files (JPG, PNG) are allowed.');
        return;
      }

      // ✅ Validate file size (<= 1 MB)
      const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
      if (file.size > maxSizeInBytes) {
        alert('File size should not exceed 1 MB.');
        return;
      }

      setFormData({ ...formData, file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic field validation
    for (const key in formData) {
      if (!formData[key]) {
        alert(`Please fill ${key.replace('_', ' ')}`);
        return;
      }
    }

    // ✅ Convert file to Base64
    const fileContent = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(formData.file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });

    // ✅ Payload for backend
    const payload = {
      loan_reference_number: String(formData.loan_reference_number),
      loan_start_date: String(formData.loan_start_date),
      tenure_in_months: String(formData.tenure_in_months),
      emi_amount: String(formData.emi_amount),
      total_money_taken: String(formData.total_money_taken),
      emi_date: String(formData.emi_date),
      loanDescription: String(formData.loanDescription),
      loanFileName: formData.file?.name || '',
      base64LoanDocContent: fileContent || '',
    };

    console.log('Payload sent to backend:', payload);

    try {
      const response = await registerLoan(payload);
      alert(response.message || 'Loan registered successfully');
      onClose();
    } catch (err) {
      alert(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Register Loan</h2>
        <form onSubmit={handleSubmit}>
          <label>Loan Reference Number</label>
          <input
            type="text"
            name="loan_reference_number"
            maxLength={100}
            value={formData.loan_reference_number}
            onChange={handleChange}
          />

          <label>Loan Start Date</label>
          <input
            type="date"
            name="loan_start_date"
            value={formData.loan_start_date}
            onChange={handleChange}
          />

          <label>Tenure (in Months)</label>
          <input
            type="number"
            name="tenure_in_months"
            value={formData.tenure_in_months}
            onChange={handleChange}
          />

          <label>EMI Amount</label>
          <input
            type="number"
            step="0.01"
            name="emi_amount"
            value={formData.emi_amount}
            onChange={handleChange}
          />

          <label>Total Money Taken</label>
          <input
            type="number"
            step="0.01"
            name="total_money_taken"
            value={formData.total_money_taken}
            onChange={handleChange}
          />

          <label>EMI Date</label>
          <select
            name="emi_date"
            value={formData.emi_date}
            onChange={handleChange}
          >
            <option value="">Select EMI Date</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <label>Loan Description</label>
          <textarea
            name="loanDescription"
            value={formData.loanDescription}
            onChange={handleChange}
          />

          <label>Upload Document (PDF or Image ≤ 1 MB)</label>
          <input
            type="file"
            name="file"
            accept=".pdf,image/png,image/jpeg,image/jpg"
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterLoanModal;
