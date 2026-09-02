function Alert({
  type = "error",
  message,
  onClose,
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`alert alert-${type}`}
    >
      <span>{message}</span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="alert-close"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Alert;