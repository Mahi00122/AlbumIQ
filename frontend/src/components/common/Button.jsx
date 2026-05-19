const styles = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(124,61,143,0.28)] transition hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center rounded-full border border-[rgba(124,61,143,0.14)] bg-white/85 px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:border-[rgba(124,61,143,0.3)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-[var(--primary)] transition hover:bg-[rgba(124,61,143,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
};

function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}) {
  return (
    <button className={`${styles[variant] || styles.primary} ${className}`} type={type} {...props}>
      {children}
    </button>
  );
}

export default Button;
