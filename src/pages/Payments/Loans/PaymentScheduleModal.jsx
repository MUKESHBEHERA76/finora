import React from "react";
import "./PaymentScheduleModal.css";

function PaymentScheduleModal({ loan, onClose }) {
  const startDateStr = loan.loan_taken_date.split(" ")[0]; // YYYY-MM-DD
  const tenure = parseInt(loan.tenure_in_months);
  const emiAmount = parseFloat(loan.emi_amount);

  const today = new Date();

  // Parse backend date string into {year, month, day}
  const parseDateStr = (dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return { year, month, day };
  };

  // Format date as DD/MM/YYYY
  const formatDate = ({ year, month, day }) => {
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  };

  // Generate schedule
  const schedule = [];
  let { year, month, day } = parseDateStr(startDateStr);

  // Start from startDate + 1 month
  month += 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }

  for (let i = 0; i < tenure; i++) {
    // Determine due date
    const dueDateObj = new Date(year, month - 1, day); // JS month is 0-based
    const dueDateStr = formatDate({ year: dueDateObj.getFullYear(), month: dueDateObj.getMonth() + 1, day: dueDateObj.getDate() });

    // Determine paid/pending
    const paid = dueDateObj < today;

    schedule.push({
      month: i + 1,
      dueDate: dueDateStr,
      paid,
      amount: emiAmount.toFixed(2),
    });

    // Increment month
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

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
