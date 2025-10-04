import "./Loans.css";
import React, { useEffect, useState } from "react";
import { FaMoneyBill, FaFilePdf, FaCalendarCheck, FaCoins } from "react-icons/fa";
import RegisterLoanModal from "./RegisterLoanModal";
import PaymentScheduleModal from "./PaymentScheduleModal";
import DocumentPreviewModal from "./DocumentPreviewModal";
import ForcloseLoanModal from "./ForcloseLoanModal"; 
import { getLoans, fetchLoanDocument } from "../../../services/loanService";

function Loans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isDocPreviewOpen, setIsDocPreviewOpen] = useState(false);
  const [isForcloseOpen, setIsForcloseOpen] = useState(false);
  const [loans, setLoans] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedForcloseLoan, setSelectedForcloseLoan] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [noClosedLoan, setNoClosedLoan] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadLoans = async (activeStatus = true) => {
    setLoading(true);
    setLoans([]);
    setNoClosedLoan(false);
    setShowCards(false);

    try {
      const res = await getLoans(activeStatus);

      if (!activeStatus && res.status === 500) {
        setLoans([]);
        setNoClosedLoan(true);
        return;
      }

      const loansData = res.loans || [];
      setLoans(loansData);
      setNoClosedLoan(false);

      if (activeStatus) setShowCards(true);
    } catch (err) {
      setLoans([]);
      setShowCards(false);
      if (!activeStatus) setNoClosedLoan(true);
      else alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans(true);
  }, []);

  const handleViewDoc = async (docId) => {
    try {
      const res = await fetchLoanDocument(docId);
      if (res.documents && res.documents.length > 0) {
        const doc = res.documents[0];
        const mimeType = doc.document_name.endsWith(".pdf") ? "application/pdf" : "image/png";
        setPreviewDoc({ mimeType, base64: doc.documentBase64Content, name: doc.document_name });
        setIsDocPreviewOpen(true);
      } else {
        alert("No document found");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShowSchedule = (loan) => {
    setSelectedLoan(loan);
    setIsScheduleOpen(true);
  };

  const handleForcloseLoan = (loan) => {
    setSelectedForcloseLoan(loan);
    setIsForcloseOpen(true);
  };

  // ===== CARD CALCULATIONS =====
  const totalLoanRunning = loans.length;
  const monthlyEmi = loans.reduce((sum, loan) => sum + Number(loan.emi_amount || 0), 0);

  const loansClosingThisMonth = loans.filter((loan) => {
    const endDate = new Date(loan.loan_end_date);
    const today = new Date();
    return endDate.getMonth() === today.getMonth() && endDate.getFullYear() === today.getFullYear();
  }).length;

  return (
    <>
      <header className="loans-header">
        <p>Home / Payments / Loans</p>
      </header>

      <div className="loan-actions">
        <button className="register-loan-btn" onClick={() => setIsModalOpen(true)}>
          Register Loan
        </button>

        <select
          className="loan-filter"
          value={isActive ? "active" : "closed"}
          onChange={(e) => {
            const val = e.target.value === "active";
            setIsActive(val);
            loadLoans(val);
          }}
        >
          <option value="active">Active Loans</option>
          <option value="closed">Closed Loans</option>
        </select>
      </div>

      {/* ===== CARDS ===== */}
      {showCards && loans.length > 0 && (
        <div className="loan-cards">
          <div className="loan-card">
            <FaCoins className="card-icon" />
            <div className="card-info">
              <p>Total Loan Running</p>
              <h3>{totalLoanRunning}</h3>
            </div>
          </div>

          <div className="loan-card">
            <FaMoneyBill className="card-icon" />
            <div className="card-info">
              <p>Monthly EMI</p>
              <h3>{monthlyEmi}</h3>
            </div>
          </div>

          <div className="loan-card">
            <FaCalendarCheck className="card-icon" />
            <div className="card-info">
              <p>Loans Closing This Month</p>
              <h3>{loansClosingThisMonth}</h3>
            </div>
          </div>
        </div>
      )}

      {/* ===== LOADING ===== */}
      {loading && <p style={{ textAlign: "center", marginTop: "20px" }}>Loading loans...</p>}

      <div className="loans-table-container">
        <table className="loans-table">
          <thead>
            <tr>
              <th>Loan Ref#</th>
              <th>Emi start Date</th>
              <th>End Date</th>
              <th>EMI Date</th>
              <th>Tenure</th>
              <th>EMI Amt</th>
              <th>Total Loan</th>
              <th>Description</th>
              {isActive && <>
                <th>Schedule</th>
                <th>Forclose</th>
                <th>View Doc</th>
              </>}
              {!isActive && <th>View Doc</th>}
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? loans.map(loan => (
              <tr key={loan.loan_reference_number}>
                <td data-label="Ref#">{loan.loan_reference_number}</td>
                <td data-label="Start">{loan.loan_taken_date}</td>
                <td data-label="End">{loan.loan_end_date}</td>
                <td data-label="EMI Date">{loan.emi_date}</td>
                <td data-label="Tenure">{loan.tenure_in_months}</td>
                <td data-label="EMI">{loan.emi_amount}</td>
                <td data-label="Total">{loan.total_money_taken}</td>
                <td data-label="Desc">{loan.loandescription}</td>

                {isActive && <>
                  <td>
                    <button className="icon-btn schedule" onClick={() => handleShowSchedule(loan)}>
                      <FaMoneyBill /> Schedule
                    </button>
                  </td>
                  <td>
                    <button className="icon-btn forclose" onClick={() => handleForcloseLoan(loan)}>
                      💰 Forclose
                    </button>
                  </td>
                  <td>
                    <button className="icon-btn view" onClick={() => handleViewDoc(loan.document_id)}>
                      <FaFilePdf /> View
                    </button>
                  </td>
                </>}

                {!isActive && <td>
                  <button className="icon-btn view" onClick={() => handleViewDoc(loan.document_id)}>
                    <FaFilePdf /> View
                  </button>
                </td>}
              </tr>
            )) : (
              <tr>
                <td colSpan={isActive ? 11 : 8} style={{ textAlign: "center" }}>
                  {noClosedLoan ? "No closed loan found" : "No loans found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <RegisterLoanModal 
          onClose={() => setIsModalOpen(false)}
          refreshLoans={() => loadLoans(isActive)}
        />
      )}

      {isScheduleOpen && selectedLoan && (
        <PaymentScheduleModal loan={selectedLoan} onClose={() => setIsScheduleOpen(false)} />
      )}

      {isDocPreviewOpen && previewDoc && (
        <DocumentPreviewModal doc={previewDoc} onClose={() => setIsDocPreviewOpen(false)} />
      )}

      {isForcloseOpen && selectedForcloseLoan && (
        <ForcloseLoanModal
          loanRef={selectedForcloseLoan}
          onClose={() => setIsForcloseOpen(false)}
          refreshLoans={() => loadLoans(isActive)}
        />
      )}
    </>
  );
}

export default Loans;
