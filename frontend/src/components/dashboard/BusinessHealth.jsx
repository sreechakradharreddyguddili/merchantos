function BusinessHealth({
  health = "unknown",
}) {
  const normalizedHealth =
    String(health).toLowerCase();

  const label =
    normalizedHealth
      .charAt(0)
      .toUpperCase() +
    normalizedHealth.slice(1);

  return (
    <section className="business-health-card">

      <div className="business-health-content">

        <span className="section-label">
          BUSINESS HEALTH
        </span>

        <h2>{label}</h2>

        <p>
          Latest AI assessment of your
          business performance.
        </p>

      </div>

      <div className="health-icon">
        !
      </div>

    </section>
  );
}

export default BusinessHealth;