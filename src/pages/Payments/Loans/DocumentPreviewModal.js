import "./DocumentPreviewModal.css";

function DocumentPreviewModal({ doc, onClose }) {
  const isPDF = doc.mimeType === "application/pdf";

  return (
    <div className="modal-backdrop">
      <div className="modal-content doc-preview">
        <h3>{doc.name}</h3>
        <div className="preview-container">
          {isPDF ? (
            <iframe
              src={`data:application/pdf;base64,${doc.base64}`}
              title="Document Preview"
              width="100%"
              height="500px"
            />
          ) : (
            <img
              src={`data:${doc.mimeType};base64,${doc.base64}`}
              alt="Loan Document"
              className="preview-image"
            />
          )}
        </div>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default DocumentPreviewModal;
