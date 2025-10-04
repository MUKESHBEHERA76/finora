import React from "react";
import "./PaymentScheduleModal.css";

function PaymentScheduleModal({ loan, onClose }) {
  const startDate = new Date(loan.loan_taken_date);
  const tenure = parseInt(loan.tenure_in_months);
  const emiAmount = parseFloat(loan.emi_amount);
  const today = new Date();

  const schedule = Array.from({ length: tenure }, (_, i) => {
    const dueDate = new Date(startDate);
    dueDate.setMonth(startDate.getMonth() + i);
    return {
      month: i + 1,
      dueDate: dueDate.toLocaleDateString(),
      paid: dueDate < today,
      amount: emiAmount.toFixed(2),
    };
  });

  const paidCount = schedule.filter((s) => s.paid).length;
  const remainingCount = tenure - paidCount;
  const totalPaid = paidCount * emiAmount;
  const remainingBalance = remainingCount * emiAmount;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Payment Schedule - Loan #{loan.loan_reference_number}</h2>

        <div className="table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s) => (
                <tr key={s.month}>
                  <td>{s.month}</td>
                  <td>{s.dueDate}</td>
                  <td>{s.paid ? "Paid ✅" : "Pending ⏳"}</td>
                  <td>{s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="schedule-summary">
          <p>Total Paid: ₹{totalPaid.toFixed(2)}</p>
          <p>Remaining Balance: ₹{remainingBalance.toFixed(2)}</p>
          <p>Payments Done: {paidCount}/{tenure}</p>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default PaymentScheduleModal;
