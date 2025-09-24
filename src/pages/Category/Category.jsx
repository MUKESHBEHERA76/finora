import React, { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Category.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        if (data.categoryList) {
          setCategories(data.categoryList);
          setError("");
        } else {
          setError("Unexpected response structure");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = categories.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(categories.length / rowsPerPage);

  return (
    <>
      <header className="dashboard-header">
        <p>Home / Category</p>
      </header>

      <div className="categories-container">
        {error && <div className="error-message">{error}</div>}

        {!error && categories.length > 0 && (
          <div className="table-responsive">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Category ID</th>
                  <th>Name</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((cat) => (
                  <tr key={cat.category_id}>
                    <td>
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.category_name}
                          className="category-img"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td>
                      {cat.category_id
                        ? `${cat.category_id.substring(0, 3)}****`
                        : ""}
                    </td>
                    <td>{cat.category_name}</td>
                    <td>{cat.category_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Compact Pagination */}
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="pagination-icon"
              >
                <FaChevronLeft />
              </button>

              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="pagination-icon"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Category;
