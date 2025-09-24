import React, { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";
import { getCategories } from "../../services/categoryService";
import axios from "axios";
import Cookies from "js-cookie";
import API_CONFIG from "../../config";
import "./Transactions.css";
import {
  FaPiggyBank,
  FaWallet,
  FaMoneyBillWave,
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";

const Transactions = ({ navigate }) => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("this-month");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totals, setTotals] = useState({ savingTotal: 0, earningTotal: 0, expenseTotal: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category_type: "",
    category_name: "",
    category_image_url: "",
    transaction_date: "",
    amount: "",
    short_note: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const transactionsPerPage = 10;

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const data = await getTransactions({ filter, startDate, endDate });
      setTransactions(data.results || []);
      setTotals(data.totalAmount || { savingTotal: 0, earningTotal: 0, expenseTotal: 0 });
      setError("");
      setCurrentPage(1);
    } catch (err) {
      setTransactions([]);
      setTotals({ savingTotal: 0, earningTotal: 0, expenseTotal: 0 });
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch categories
  const openAddTransactionModal = async () => {
    setShowModal(true);
    setLoadingCategories(true);
    setError("");
    try {
      const data = await getCategories(); // backend returns { categoryList: [...] }
      if (data && Array.isArray(data.categoryList)) {
        setCategories(data.categoryList);
      } else {
        setCategories([]);
        console.warn("Unexpected categories response:", data);
      }
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // Input handlers
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCategoryTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      category_type: e.target.value,
      category_name: "",
      category_image_url: "",
    }));
  };

  const handleCategoryNameChange = (e) => {
    const selectedCategory = categories.find(
      c => c.category_type === formData.category_type && c.category_name === e.target.value
    );
    setFormData(prev => ({
      ...prev,
      category_name: e.target.value,
      category_image_url: selectedCategory?.image_url || "",
    }));
  };

  // Submit transaction
  const submitTransaction = async () => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    const email = user ? JSON.parse(user).email : null;
    const application = API_CONFIG.APPLICATION_NAME;

    if (!formData.category_type || !formData.category_name || !formData.transaction_date || !formData.amount) {
      setSubmitMessage("Please fill all mandatory fields!");
      return;
    }

    setSubmitLoading(true);
    setSubmitMessage("");

    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.INSERT_TRANSACTIONS}`,
        { email, application, ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitMessage(response.data.message || "Transaction added successfully");
      setShowModal(false);
      fetchTransactions();
    } catch (err) {
      setSubmitMessage(err.response?.data?.error || err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Pagination
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  return (
    <>
      <header className="dashboard-header">
        <p>Home / Transactions</p>
      </header>

      <div className="transactions-container">
        {/* Cards */}
        <div className="dashboard-cards">
          <div className="card saving">
            <div className="card-icon"><FaPiggyBank /></div>
            <div className="card-info">
              <h4>Saving</h4>
              <p>₹{Number(totals.savingTotal).toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="card earning">
            <div className="card-icon"><FaWallet /></div>
            <div className="card-info">
              <h4>Earning</h4>
              <p>₹{Number(totals.earningTotal).toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="card expense">
            <div className="card-icon"><FaMoneyBillWave /></div>
            <div className="card-info">
              <h4>Expense</h4>
              <p>₹{Number(totals.expenseTotal).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>

        {/* Filter and Add Transaction */}
        <div className="filter-add-section">
          <div className="filter-section">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="today">Today</option>
              <option value="this-month">This Month</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom</option>
            </select>

            {filter === "custom" && (
              <>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </>
            )}

            <button onClick={fetchTransactions}>View</button>
          </div>

          <button className="add-transaction-btn" onClick={openAddTransactionModal}>
            <FaPlus /> Add Transaction
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Add Transaction Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add Transaction</h3>
              {loadingCategories ? (
                <div className="loading-spinner"><FaSpinner className="spin" /> Loading...</div>
              ) : (
                <>
                  <div className="form-group">
                    <label>Category Type*</label>
                    <select name="category_type" value={formData.category_type} onChange={handleCategoryTypeChange}>
                      <option value="">Select Type</option>
                      {[...new Set(categories.map(c => c.category_type))].map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {formData.category_type && (
                    <div className="form-group">
                      <label>Category Name*</label>
                      <select name="category_name" value={formData.category_name} onChange={handleCategoryNameChange}>
                        <option value="">Select Category</option>
                        {categories
                          .filter(c => c.category_type === formData.category_type)
                          .map(c => (
                            <option key={c.category_id} value={c.category_name}>
                              {c.category_name}
                            </option>
                          ))}
                      </select>
                      {formData.category_image_url && (
                        <img src={formData.category_image_url} alt="icon" className="category-preview" />
                      )}
                    </div>
                  )}

                  <div className="form-group">
                    <label>Transaction Date*</label>
                    <input type="date" name="transaction_date" value={formData.transaction_date} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>Amount*</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>Short Note (Optional)</label>
                    <input type="text" name="short_note" value={formData.short_note} onChange={handleInputChange} />
                  </div>

                  {submitMessage && <div className="submit-message">{submitMessage}</div>}

                  <div className="modal-actions">
                    <button onClick={submitTransaction} disabled={submitLoading}>
                      {submitLoading ? <FaSpinner className="spin" /> : "Submit Transaction"}
                    </button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="table-wrapper">
          <div className="table-responsive">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Note</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.map((t) => (
                  <tr key={t.tn_id}>
                    <td><img src={t.image_id} alt="category" className="category-img" /></td>
                    <td>{t.category_name}</td>
                    <td>{t.category_type}</td>
                    <td>{t.short_note}</td>
                    <td>{t.transaction_date}</td>
                    <td>₹{Number(t.amount).toLocaleString("en-IN")}</td>
                    <td className="action-buttons">
                      <button className="edit-btn" title="Edit"><FaEdit /></button>
                      <button className="delete-btn" title="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transactions.length > transactionsPerPage && (
            <div className="pagination">
              <button
                className="pagination-icon"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaArrowLeft className="animated-arrow" />
              </button>
              <span className="page-info">{currentPage} / {totalPages}</span>
              <button
                className="pagination-icon"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <FaArrowRight className="animated-arrow" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Transactions;
