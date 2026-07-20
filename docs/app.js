(function corporateStartupPilotEvidenceGate() {
  "use strict";

  const source = Array.isArray(window.CORPORATE_PILOT_GATES) ? window.CORPORATE_PILOT_GATES : [];
  const original = source.map((gate) => ({ ...gate }));
  let gates = original.map((gate) => ({ ...gate }));
  const list = document.querySelector("#gate-list");
  const template = document.querySelector("#gate-card-template");
  const searchInput = document.querySelector("#search-input");
  const groupFilter = document.querySelector("#group-filter");
  const stateFilter = document.querySelector("#state-filter");
  const status = document.querySelector("#action-status");
  const stateReason = {
    supported: "evidence_confirmed",
    partial: "evidence_partial",
    missing: "evidence_missing",
    conflicting: "evidence_conflict",
    stale: "evidence_stale",
    not_applicable: "gate_not_applicable",
  };

  const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const setStatus = (message) => { status.textContent = message; };
  const updateGate = (id, field, value) => {
    const gate = gates.find((item) => item.gate_id === id);
    if (!gate) return;
    gate[field] = value;
    if (field === "current_state") gate.reason_code = stateReason[value];
    updateSummary();
  };

  function currentView() {
    const query = searchInput.value.trim().toLowerCase();
    return gates.filter((gate) => {
      const groupMatches = groupFilter.value === "all" || gate.gate_group === groupFilter.value;
      const stateMatches = stateFilter.value === "all" || gate.current_state === stateFilter.value;
      const haystack = [
        gate.gate_id, gate.gate_group, gate.ddscore_dimension, gate.decision_question,
        gate.next_artifact, gate.owner,
      ].join(" ").toLowerCase();
      return groupMatches && stateMatches && (!query || haystack.includes(query));
    });
  }

  function updateSummary() {
    const repairStates = new Set(["partial", "missing", "conflicting", "stale"]);
    document.querySelector("#visible-count").textContent = String(currentView().length);
    document.querySelector("#supported-count").textContent = String(
      gates.filter((gate) => gate.current_state === "supported").length,
    );
    document.querySelector("#repair-count").textContent = String(
      gates.filter((gate) => repairStates.has(gate.current_state)).length,
    );
    document.querySelector("#unreviewed-count").textContent = String(
      gates.filter((gate) => gate.reviewer_decision === "unreviewed").length,
    );
  }

  function bindInput(card, selector, gate, field, eventName = "input") {
    const control = card.querySelector(selector);
    control.value = gate[field] || "";
    control.addEventListener(eventName, () => updateGate(gate.gate_id, field, control.value));
  }

  function render() {
    list.replaceChildren();
    const visible = currentView();
    if (visible.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "No gate matches the current filters.";
      list.append(empty);
    }
    for (const gate of visible) {
      const card = template.content.firstElementChild.cloneNode(true);
      card.dataset.gateId = gate.gate_id;
      card.querySelector(".gate-id").textContent = gate.gate_id;
      card.querySelector(".gate-group").textContent = gate.gate_group.replaceAll("_", " ");
      card.querySelector(".gate-dimension").textContent = gate.ddscore_dimension.replaceAll("_", " ");
      card.querySelector(".gate-question").textContent = gate.decision_question;
      bindInput(card, ".current-state", gate, "current_state", "change");
      bindInput(card, ".evidence-ref", gate, "evidence_ref");
      bindInput(card, ".observed-at", gate, "observed_at", "change");
      bindInput(card, ".evidence-hash", gate, "evidence_hash");
      bindInput(card, ".owner", gate, "owner");
      bindInput(card, ".next-artifact", gate, "next_artifact");
      bindInput(card, ".reviewer-decision", gate, "reviewer_decision", "change");
      bindInput(card, ".reviewer-rationale", gate, "reviewer_rationale");
      card.querySelector(".gate-footnote").textContent =
        `Expected evidence: ${gate.evidence_type.replaceAll("_", " ")} · freshness window: ${gate.freshness_days} days`;
      list.append(card);
    }
    updateSummary();
  }

  const groups = [...new Set(gates.map((gate) => gate.gate_group))].sort();
  for (const group of groups) {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group.replaceAll("_", " ");
    groupFilter.append(option);
  }
  for (const control of [searchInput, groupFilter, stateFilter]) {
    control.addEventListener(control.tagName === "INPUT" ? "input" : "change", render);
  }
  document.querySelector("#reset-button").addEventListener("click", () => {
    gates = original.map((gate) => ({ ...gate }));
    searchInput.value = "";
    groupFilter.value = "all";
    stateFilter.value = "all";
    render();
    setStatus("Reset all 20 gates to the starter state.");
  });
  document.querySelector("#export-button").addEventListener("click", () => {
    const fields = [
      "gate_id", "gate_group", "ddscore_dimension", "decision_question", "current_state",
      "evidence_ref", "evidence_type", "observed_at", "evidence_hash", "owner",
      "freshness_days", "reason_code", "next_artifact", "reviewer_decision",
      "reviewer_rationale",
    ];
    const csv = [fields.join(","), ...gates.map((gate) =>
      fields.map((field) => csvEscape(gate[field])).join(",")
    )].join("\r\n");
    const href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "corporate-startup-pilot-evidence-gate-review.csv";
    anchor.click();
    URL.revokeObjectURL(href);
    setStatus("Exported all 20 gates and 15 fields as CSV.");
  });

  render();
}());
