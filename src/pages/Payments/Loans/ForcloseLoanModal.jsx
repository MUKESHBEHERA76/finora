import React, { useState } from "react";
import "./PaymentScheduleModal.css"; // reuse modal CSS
import { forcloseLoan } from "../../../services/loanService";

function ForcloseLoanModal({ loanRef, onClose, refreshLoans }) {
  const [forecloseDate, setForecloseDate] = useState("");
  const [forcloseAmountPaid, setForcloseAmountPaid] = useState("");
  const [shortNote, setShortNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!forecloseDate || !forcloseAmountPaid || !shortNote) {
      alert("All fields are mandatory");
      return;
    }

    setSubmitting(true);
    try {
      const res = await forcloseLoan({
        loanRefnumber: loanRef.loan_reference_number,
        forecloseDate,
        forcloseAmountPaid: forcloseAmountPaid.toString(),
        shortNote,
      });
      alert(res.message || "Loan foreclosed successfully");
      onClose();
      refreshLoans();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Foreclose Loan</h2>
        <div className="schedule-summary">
          <p>
            Loan Ref#: <strong>{loanRef.loan_reference_number}</strong>
          </p>
          <p>
            Foreclose Date:
            <input type="date" value={forecloseDate} onChange={(e) => setForecloseDate(e.target.value)} />
          </p>
          <p>
            Amount Paid:
            <input type="number" step="0.01" value={forcloseAmountPaid} onChange={(e) => setForcloseAmountPaid(e.target.value)} />
          </p>
          <p>
            Short Note:
            <textarea value={shortNote} onChange={(e) => setShortNote(e.target.value)} />
          </p>
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit} disabled={submitting}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ForcloseLoanModal;
