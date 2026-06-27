import "../styles/ConfirmModal.css";

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel
}) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="confirm-modal">
                <h3>{title}</h3>

                <p>{message}</p>

                <div className="modal-actions">
                    <button
                        className="modal-cancel"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="modal-delete"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}