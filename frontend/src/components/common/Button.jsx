function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`button button-${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading
        ? "Processing..."
        : children}
    </button>
  );
}

export default Button;