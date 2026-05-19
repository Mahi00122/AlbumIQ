function Footer() {
  return (
    <footer className="page-shell pt-0">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-[rgba(117,82,65,0.12)] bg-[rgba(255,251,247,0.82)] px-6 py-7 text-sm text-[var(--muted)] shadow-[0_18px_40px_rgba(87,56,42,0.08)] backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[var(--text)]">FindMyShaadi Pics</p>
            <p className="mt-1">Designed for elegant guest access, faster delivery, and calmer wedding operations.</p>
          </div>
          <p className="max-w-md text-left sm:text-right">
            QR-driven entry, selfie search, and event-specific galleries for modern photographers and large wedding albums.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
