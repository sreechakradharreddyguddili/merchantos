function ActionStats({
  total = 0,
  pending = 0,
  completed = 0,
  rejected = 0,
}) {
  const stats = [
    {
      label: "TOTAL ACTIONS",
      value: total,
      icon: "◎",
    },
    {
      label: "PENDING",
      value: pending,
      icon: "◷",
    },
    {
      label: "COMPLETED",
      value: completed,
      icon: "✓",
    },
    {
      label: "REJECTED",
      value: rejected,
      icon: "×",
    },
  ];

  return (
    <div className="dashboard-metrics">

      {stats.map((stat) => (
        <div
          className="dashboard-metric"
          key={stat.label}
        >

          <div className="stat-icon">
            {stat.icon}
          </div>

          <div className="stat-content">

            <span className="metric-label">
              {stat.label}
            </span>

            <strong className="metric-value">
              {stat.value}
            </strong>

          </div>

        </div>
      ))}

    </div>
  );
}

export default ActionStats;