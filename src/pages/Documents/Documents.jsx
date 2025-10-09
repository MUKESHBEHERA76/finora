import "./Documents.css";
import React, { useState, useEffect } from "react";
import {
  uploadDocument,
  fetchDocuments,
  fetchDocumentById,
  deleteDocument,
} from "../../services/documentService";
import { FaEye, FaTrash, FaDownload, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Documents() {
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [file, setFile] = useState(null);
  const [deletionDate, setDeletionDate] = useState("");
  const [shortNote, setShortNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); 
  const [documents, setDocuments] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [deleteDocId, setDeleteDocId] = useState(null);

  // Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch documents initially
  useEffect(() => {
    const fetchInitialDocuments = async () => {
      try {
        const res = await fetchDocuments();
        setDocuments(res.documents || []);
      } catch (err) {
        setMessage(err.message);
      }
    };
    fetchInitialDocuments();
  }, []);

  const refreshDocuments = async () => {
    try {
      const res = await fetchDocuments();
      setDocuments(res?.documents || []);
      setCurrentPage(1); 
    } catch (err) {}
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    const fileSize = selectedFile.size;

    if (!(fileType === "application/pdf" || fileType.startsWith("image/"))) {
      alert("Only PDF and image files are allowed.");
      return;
    }
    if (fileType === "application/pdf" && fileSize > 2 * 1024 * 1024) {
      alert("PDF file size should not exceed 2MB.");
      return;
    }
    if (fileType.startsWith("image/") && fileSize > 1 * 1024 * 1024) {
      alert("Image file size should not exceed 1MB.");
      return;
    }

    setFile(selectedFile);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !deletionDate || !shortNote) {
      alert("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const base64Content = await toBase64(file);
      const payload = {
        fileBase64Content: base64Content,
        fileName: file.name,
        documentDeletionDate: deletionDate,
        shortNote,
      };
      const res = await uploadDocument(payload);
      alert(res.message || "File uploaded successfully!");
      setFile(null);
      setDeletionDate("");
      setShortNote("");
      setShowModal(false);
      await refreshDocuments();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (docId) => {
    try {
      const res = await fetchDocumentById(docId);
      if (res.documents && res.documents.length > 0) {
        setPreviewDoc(res.documents[0]);
        setShowPreview(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownload = (doc) => {
    const link = document.createElement("a");
    const mimeType = doc.document_name.endsWith(".pdf")
      ? "application/pdf"
      : "image/png";
    link.href = `data:${mimeType};base64,${doc.documentBase64Content}`;
    link.download = doc.document_name;
    link.click();
  };

  const confirmDelete = (docId) => {
    setDeleteDocId(docId);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteDocId) return;
    try {
      setLoading(true);
      setShowDeleteConfirm(false);
      const res = await deleteDocument(deleteDocId);
      alert(res.message || "Document deleted successfully.");
      setDeleteDocId(null);
      setDocuments([]);
      await refreshDocuments();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Apply filter
  const filteredDocs = documents.filter((doc) =>
    doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_short_note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDocs.length / rowsPerPage);
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <header className="documents-header">
        <p>Home / Documents</p>
      </header>

      <div className="documents-actions">
        <button className="upload-btn" onClick={() => setShowModal(true)}>
          Upload Document
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {/* Centered Single Filter Box */}
      <div style={{ display: "flex", justifyContent: "center", margin: "15px 0" }}>
        <input
          type="text"
          placeholder="Search by Name or Note"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{ width: "50%", padding: "8px" }}
        />
      </div>

      <div className="documents-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Upload Date</th>
              <th>Deletion Date</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDocs.length > 0 ? (
              paginatedDocs.map((doc) => (
                <tr key={doc.document_id}>
                  <td data-label="Name">{doc.document_name}</td>
                  <td data-label="Upload Date">{doc.document_upload_date?.substring(0, 10) || "-"}</td>
                  <td data-label="Deletion Date">{doc.document_deletion_date?.substring(0, 10) || "-"}</td>
                  <td data-label="Note">{doc.document_short_note}</td>
                  <td data-label="Actions">
                    <button onClick={() => handleView(doc.document_id)} title="View">
                      <FaEye />
                    </button>
                    <button onClick={() => confirmDelete(doc.document_id)} title="Delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        
      </div>
      {/* Pagination */}
        {filteredDocs.length > rowsPerPage && (
          <div className="pagination" style={{ textAlign: "center", marginTop: "10px"}}>
            <FaChevronLeft
              onClick={handlePrevPage}
              style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer", marginRight: "10px", color: currentPage === 1 ? "#ccc" : "#000" }}
            />
            <span style={{ margin: "0 10px" }}>
              {currentPage} / {totalPages}
            </span>
            <FaChevronRight
              onClick={handleNextPage}
              style={{ cursor: currentPage === totalPages ? "not-allowed" : "pointer", marginLeft: "10px", color: currentPage === totalPages ? "#ccc" : "#000" }}
            />
          </div>
        )}

      {/* Upload Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Upload Document</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Choose File (Image ≤1MB or PDF ≤2MB)</label>
                <input type="file" accept="image/*,.pdf" onChange={handleFileChange} />
              </div>
              <div className="form-group">
                <label>File Deletion Date</label>
                <input
                  type="date"
                  value={deletionDate}
                  onChange={(e) => setDeletionDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Short Note</label>
                <textarea
                  rows="3"
                  value={shortNote}
                  onChange={(e) => setShortNote(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewDoc && (
        <div className="modal-overlay">
          <div className="modal preview-modal">
            <h2>Preview: {previewDoc.document_name}</h2>
            {previewDoc.document_name.endsWith(".pdf") ? (
              <iframe
                src={`data:application/pdf;base64,${previewDoc.documentBase64Content}`}
                width="100%"
                height="100vh"
                title="pdf-preview"
              />
            ) : (
              <img
                src={`data:image/png;base64,${previewDoc.documentBase64Content}`}
                alt={previewDoc.document_name}
                style={{ maxWidth: "80%", maxHeight: "80vh" }}
              />
            )}
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowPreview(false)}>
                Close
              </button>
              <button className="submit-btn" onClick={() => handleDownload(previewDoc)}>
                <FaDownload /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this document?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Documents;
