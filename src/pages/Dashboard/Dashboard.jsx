import "./Dashboard.css";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardInfo } from "../../services/dashboardService";
import { FaWallet, FaMoneyBillWave, FaPiggyBank } from "react-icons/fa";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardInfo();
        setDashboardData(data);
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const barChartData = dashboardData
    ? months.map((month, idx) => ({
        month,
        earning: Number(dashboardData.yearlyEarningList[idx] || 0),
        expense: Number(dashboardData.yearlyExpenseList[idx] || 0),
      }))
    : [];

  return (
    <>
      <header className="dashboard-header">
        <p>Home / Dashboard</p>
      </header>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {error && (
        <p style={{ color: "red", textAlign: "center", margin: "20px 0" }}>
          {error}
        </p>
      )}

      {dashboardData && (
        <div className="dashboard-wrapper">
          {/* Cards */}
          <div className="dashboard-cards">
            <div className="card earning">
              <div className="card-icon">
                <FaWallet size={24} />
              </div>
              <h4>Earning</h4>
              <p>₹{Number(dashboardData.earningSum).toLocaleString("en-IN")}</p>
            </div>
            <div className="card expense">
              <div className="card-icon">
                <FaMoneyBillWave size={24} />
              </div>
              <h4>Expense</h4>
              <p>₹{Number(dashboardData.expenseSum).toLocaleString("en-IN")}</p>
            </div>
            <div className="card saving">
              <div className="card-icon">
                <FaPiggyBank size={24} />
              </div>
              <h4>Saving</h4>
              <p>₹{Number(dashboardData.savingSum).toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="dashboard-barchart">
            <h3>Yearly Earning vs Expense</h3>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
                  barGap={12}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis tick={{ fill: "#555", fontSize: 12 }} dataKey="month" />
                  <YAxis tick={{ fill: "#555", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      fontSize: 14,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 14 }} />
                  <Bar
                    dataKey="earning"
                    fill="#81C784"
                    radius={[10, 10, 0, 0]}
                    animationDuration={1500}
                  />
                  <Bar
                    dataKey="expense"
                    fill="#E57373"
                    radius={[10, 10, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="recent-transactions">
            <h3>Recent Transactions</h3>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentTransaction.map((t, idx) => (
                  <tr key={idx}>
                    <td>
                      <img
                        src={t.imageId}
                        alt="category"
                        className="category-img"
                      />
                    </td>
                    <td>{t.categoryName}</td>
                    <td>{t.categoryType}</td>
                    <td>₹{Number(t.amount).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
