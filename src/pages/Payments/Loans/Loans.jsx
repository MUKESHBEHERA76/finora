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
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedForcloseLoan, setSelectedForcloseLoan] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [noClosedLoan, setNoClosedLoan] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");

  // ===== PAGINATION STATE =====
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(filteredLoans.length / rowsPerPage);

  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ===== LOAD LOANS =====
  const loadLoans = async (activeStatus = true) => {
    setLoading(true);
    setLoans([]);
    setFilteredLoans([]);
    setNoClosedLoan(false);
    setShowCards(false);
    setCurrentPage(1);
    setFilterText("");

    try {
      const res = await getLoans(activeStatus);

      if (!activeStatus && res.status === 500) {
        setLoans([]);
        setFilteredLoans([]);
        setNoClosedLoan(true);
        return;
      }

      const loansData = res.loans || [];
      setLoans(loansData);
      setFilteredLoans(loansData);
      setNoClosedLoan(false);

      if (activeStatus) setShowCards(true);
    } catch (err) {
      setLoans([]);
      setFilteredLoans([]);
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

  // ===== DOCUMENT PREVIEW =====
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

  // ===== FILTER HANDLER =====
  const handleFilterChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFilterText(value);
    setCurrentPage(1); // reset pagination

    const filtered = loans.filter((loan) =>
      (loan.loan_reference_number || "").toLowerCase().includes(value) ||
      (loan.total_money_taken || "").toString().toLowerCase().includes(value) ||
      (loan.loandescription || "").toLowerCase().includes(value) ||
      (loan.emi_amount || "").toString().toLowerCase().includes(value)
    );
    setFilteredLoans(filtered);
  };

  return (
    <>
      <header className="loans-header">
        <p>Home / Payments / Loans</p>
      </header>

      {/* ===== ACTION BAR ===== */}
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


      {/* ===== FILTER BAR ===== */}
      <div className="loan-filter-bar" style={{ margin: "10px 20px" }}>
        <input
          type="text"
          placeholder="Filter by Loan Ref#, Total Loan, Description, EMI..."
          value={filterText}
          onChange={handleFilterChange}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px"
          }}
        />
      </div>




      {/* ===== LOADING ===== */}
      {loading && <p style={{ textAlign: "center", marginTop: "20px" }}>Loading loans...</p>}

      {/* ===== TABLE ===== */}
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
            {paginatedLoans.length > 0 ? paginatedLoans.map((loan) => (
              <tr key={loan.loan_reference_number}>
                <td>{loan.loan_reference_number}</td>
                <td>{loan.loan_taken_date ? loan.loan_taken_date.substring(0, 10) : ""}</td>
                <td>{loan.loan_end_date ? loan.loan_end_date.substring(0, 10) : ""}</td>
                <td>{loan.emi_date}</td>
                <td>{loan.tenure_in_months}</td>
                <td>{loan.emi_amount}</td>
                <td>{loan.total_money_taken}</td>
                <td>{loan.loandescription}</td>

                {isActive && <>
                  <td>
                    <button className="icon-btn schedule" onClick={() => handleShowSchedule(loan)}>
                      <FaMoneyBill /> Schedule
                    </button>
                  </td>
                  <td>
                    <button className="icon-btn forclose" onClick={() => handleForcloseLoan(loan)}>
                      Forclose
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

        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &#8592; Prev
            </button>

            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="pagination-icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &#8594;
            </button>
          </div>
        )}
      </div>

      {/* ===== MODALS ===== */}
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
