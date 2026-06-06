import { useEffect, useState } from "react";
import { Calendar, Flag, Tag, Trash2, UserRound, X } from "lucide-react";
import { api, errorMessage } from "../api";
import { useAppStore } from "../store";

export default function CardModal({ card, onClose, onError }) {
  const { activeBoard, activeWorkspace, updateCard, removeCard } = useAppStore();
  const [form, setForm] = useState({
    title: card.title,
    description: card.description || "",
    priority: card.priority || "medium",
    dueDate: card.dueDate ? card.dueDate.slice(0, 10) : "",
    assignee: card.assignee?._id || "",
    labels: card.labels?.join(", ") || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch(
        `/boards/${activeBoard._id}/cards/${card._id}`,
        {
          title: form.title,
          description: form.description,
          priority: form.priority,
          dueDate: form.dueDate
            ? new Date(`${form.dueDate}T12:00:00.000Z`).toISOString()
            : null,
          assignee: form.assignee || null,
          labels: form.labels
            .split(",")
            .map((label) => label.trim())
            .filter(Boolean),
        },
      );
      updateCard(data.card);
      onClose();
    } catch (requestError) {
      onError(errorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function deleteCard() {
    if (!window.confirm("Delete this card? This cannot be undone.")) return;
    try {
      await api.delete(`/boards/${activeBoard._id}/cards/${card._id}`);
      removeCard(card._id);
      onClose();
    } catch (requestError) {
      onError(errorMessage(requestError));
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal card-modal" onSubmit={save} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-heading">
          <div>
            <span className="modal-kicker">CARD DETAILS</span>
            <h2>Edit task</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}><X /></button>
        </div>
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>
        <label>
          Description
          <textarea rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add context, acceptance criteria, or useful links..." />
        </label>
        <div className="form-grid">
          <label>
            <span><Flag size={15} /> Priority</span>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </label>
          <label>
            <span><Calendar size={15} /> Due date</span>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </label>
          <label>
            <span><UserRound size={15} /> Assignee</span>
            <select value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })}>
              <option value="">Unassigned</option>
              {activeWorkspace.members?.map((membership) => (
                <option key={membership.user._id} value={membership.user._id}>
                  {membership.user.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span><Tag size={15} /> Labels</span>
            <input value={form.labels} onChange={(e) => setForm({ ...form, labels: e.target.value })} placeholder="Design, API" />
          </label>
        </div>
        <div className="modal-actions split">
          <button type="button" className="button button-danger" onClick={deleteCard}><Trash2 size={16} /> Delete</button>
          <div>
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
            <button className="button button-primary" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
