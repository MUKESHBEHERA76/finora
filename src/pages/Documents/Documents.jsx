import "./Documents.css";
import React, { useState } from "react";
import { uploadDocument } from "../../services/documentService";

function Documents() {
    const [showModal, setShowModal] = useState(false);
    const [file, setFile] = useState(null);
    const [deletionDate, setDeletionDate] = useState("");
    const [shortNote, setShortNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const fileType = selectedFile.type;
        const fileSize = selectedFile.size;

        if (
            !(
                fileType === "application/pdf" ||
                fileType.startsWith("image/")
            )
        ) {
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

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !deletionDate || !shortNote) {
            alert("All fields are required.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            // convert file to base64
            const base64Content = await toBase64(file);

            const payload = {
                fileBase64Content: base64Content,
                fileName: file.name,
                documentDeletionDate: deletionDate,
                shortNote,
            };

            const res = await uploadDocument(payload);
            alert(res.message || "File uploaded successfully!")
            setFile(null);
            setDeletionDate("");
            setShortNote("");
            setShowModal(false);
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // remove prefix
            reader.onerror = (error) => reject(error);
        });

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



            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Upload Document</h2>
                        {message && <p className="message">{message}</p>}

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
        </>
    );
}

export default Documents;
