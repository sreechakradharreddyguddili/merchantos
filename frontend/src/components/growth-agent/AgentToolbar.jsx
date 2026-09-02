import Button from "../common/Button";

function AgentToolbar({
  pendingCount = 0,
  onGenerate,
  onRefresh,
  loading = false,
}) {
  return (
    <section className="agent-toolbar">
      <div className="agent-toolbar-info">
        <strong>
          Agent Actions
        </strong>

        <span>
          {pendingCount} pending{" "}
          {pendingCount === 1
            ? "action"
            : "actions"}
        </span>
      </div>

      <div className="agent-toolbar-buttons">
        <Button
          variant="secondary"
          onClick={onRefresh}
          loading={loading}
        >
          Refresh
        </Button>

        <Button
          onClick={onGenerate}
          loading={loading}
        >
          Generate Actions
        </Button>
      </div>
    </section>
  );
}

export default AgentToolbar;