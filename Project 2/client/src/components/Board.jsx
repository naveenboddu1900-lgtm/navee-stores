import { useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Circle,
  Ellipsis,
  Filter,
  LayoutGrid,
  Link2,
  ListFilter,
  MessageSquare,
  Plus,
  Share2,
  Star,
  Users,
  Wifi,
  X,
} from "lucide-react";
import { io } from "socket.io-client";
import { api, errorMessage } from "../api";
import { useAppStore } from "../store";
import CardModal from "./CardModal";

export default function Board() {
  const {
    user,
    activeWorkspace,
    activeBoard,
    lists,
    cards,
    loadBoard,
    addList,
    updateList,
    removeList,
    addCard,
    updateCard,
    removeCard,
    reorderCards,
    applyRemoteReorder,
  } = useAppStore();
  const [newList, setNewList] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [addingCardTo, setAddingCardTo] = useState(null);
  const [cardTitle, setCardTitle] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("collabspace_token");
    const socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:4000",
      { auth: { token } },
    );
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("board:join", activeBoard._id);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("list:created", ({ list }) => addList(list));
    socket.on("list:updated", ({ list }) => updateList(list));
    socket.on("list:deleted", ({ listId }) => removeList(listId));
    socket.on("card:created", ({ card }) => addCard(card));
    socket.on("card:updated", ({ card }) => updateCard(card));
    socket.on("card:deleted", ({ cardId }) => removeCard(cardId));
    socket.on("board:reordered", ({ cards: updates, actorId }) => {
      if (actorId !== user.id) applyRemoteReorder(updates);
    });
    return () => {
      socket.emit("board:leave", activeBoard._id);
      socket.disconnect();
    };
  }, [activeBoard._id]);

  const cardsByList = useMemo(() => {
    const grouped = Object.fromEntries(lists.map((list) => [list._id, []]));
    cards.forEach((card) => {
      if (grouped[card.list]) grouped[card.list].push(card);
    });
    Object.values(grouped).forEach((items) =>
      items.sort((a, b) => a.order - b.order),
    );
    return grouped;
  }, [lists, cards]);

  async function createList(event) {
    event.preventDefault();
    if (!listTitle.trim()) return;
    try {
      const { data } = await api.post(`/boards/${activeBoard._id}/lists`, {
        title: listTitle,
      });
      addList(data.list);
      setListTitle("");
      setNewList(false);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function createCard(event, listId) {
    event.preventDefault();
    if (!cardTitle.trim()) return;
    try {
      const { data } = await api.post(`/boards/${activeBoard._id}/cards`, {
        listId,
        title: cardTitle,
      });
      addCard(data.card);
      setCardTitle("");
      setAddingCardTo(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    const updates = reorderCards(source, destination);
    try {
      await api.put(`/boards/${activeBoard._id}/reorder`, { cards: updates });
    } catch (requestError) {
      setError(`${errorMessage(requestError)} The board was refreshed.`);
      loadBoard(activeBoard._id);
    }
  }

  return (
    <section className="board-page">
      <div className="board-header">
        <div>
          <div className="breadcrumbs">
            {activeWorkspace.name} <span>/</span> Boards <span>/</span>
          </div>
          <div className="board-title-row">
            <h1>{activeBoard.name}</h1>
            <button className="icon-button star"><Star size={19} /></button>
            <span className={`live-status ${connected ? "online" : ""}`}>
              <Wifi size={14} />
              {connected ? "Live" : "Reconnecting"}
            </span>
          </div>
          <p>{activeBoard.description}</p>
        </div>
        <div className="board-header-actions">
          <div className="avatar-stack">
            {activeWorkspace.members?.slice(0, 3).map((membership) => (
              <span
                key={membership._id}
                className="user-avatar small"
                style={{ background: membership.user.avatarColor }}
                title={membership.user.name}
              >
                {initials(membership.user.name)}
              </span>
            ))}
            <button>+{Math.max((activeWorkspace.members?.length || 1) - 3, 0)}</button>
          </div>
          <button className="button button-secondary"><Share2 size={16} /> Share</button>
          <button className="icon-button bordered"><Ellipsis size={20} /></button>
        </div>
      </div>

      <div className="board-toolbar">
        <div className="view-tabs">
          <button className="active"><LayoutGrid size={16} /> Board</button>
          <button><ListFilter size={16} /> List</button>
          <button><CalendarDays size={16} /> Timeline</button>
        </div>
        <div className="toolbar-filters">
          <button><Filter size={16} /> Filter</button>
          <button><Users size={16} /> Assignee</button>
          <button><Circle size={15} /> Priority <ChevronDown size={14} /></button>
        </div>
      </div>

      {error && (
        <div className="board-error">{error}<button onClick={() => setError("")}><X size={15} /></button></div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-scroll">
          <div className="kanban-board">
            {lists
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((list) => (
                <section className="kanban-column" key={list._id}>
                  <header className="column-header">
                    <div>
                      <i className={`status-dot status-${slug(list.title)}`} />
                      <strong>{list.title}</strong>
                      <span>{cardsByList[list._id]?.length || 0}</span>
                    </div>
                    <button className="icon-button"><Ellipsis size={18} /></button>
                  </header>
                  <Droppable droppableId={list._id}>
                    {(provided, snapshot) => (
                      <div
                        className={`card-list ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {(cardsByList[list._id] || []).map((card, index) => (
                          <Draggable draggableId={card._id} index={index} key={card._id}>
                            {(dragProvided, dragSnapshot) => (
                              <article
                                className={`task-card ${dragSnapshot.isDragging ? "dragging" : ""}`}
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                onClick={() => setSelectedCard(card)}
                              >
                                <div className="task-labels">
                                  {card.labels?.map((label) => (
                                    <span key={label}>{label}</span>
                                  ))}
                                  <i className={`priority priority-${card.priority}`} title={`${card.priority} priority`} />
                                </div>
                                <h3>{card.title}</h3>
                                {card.description && <p>{card.description}</p>}
                                <footer>
                                  <div className="task-meta">
                                    {card.dueDate && <span><CalendarDays size={14} />{formatDate(card.dueDate)}</span>}
                                    <span><MessageSquare size={14} />0</span>
                                    <span><Link2 size={14} />0</span>
                                  </div>
                                  {card.assignee ? (
                                    <span className="user-avatar tiny" style={{ background: card.assignee.avatarColor }}>
                                      {initials(card.assignee.name)}
                                    </span>
                                  ) : (
                                    <span className="unassigned"><Plus size={13} /></span>
                                  )}
                                </footer>
                              </article>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {addingCardTo === list._id ? (
                    <form className="quick-card-form" onSubmit={(event) => createCard(event, list._id)}>
                      <textarea autoFocus value={cardTitle} onChange={(e) => setCardTitle(e.target.value)} placeholder="What needs to be done?" />
                      <div>
                        <button className="button button-primary button-small">Add card</button>
                        <button type="button" className="icon-button" onClick={() => setAddingCardTo(null)}><X size={18} /></button>
                      </div>
                    </form>
                  ) : (
                    <button className="add-card-button" onClick={() => setAddingCardTo(list._id)}>
                      <Plus size={17} /> Add card
                    </button>
                  )}
                </section>
              ))}
            <section className="new-column">
              {newList ? (
                <form onSubmit={createList}>
                  <input autoFocus value={listTitle} onChange={(e) => setListTitle(e.target.value)} placeholder="List title" />
                  <div>
                    <button className="button button-primary button-small"><Check size={15} /> Add list</button>
                    <button type="button" className="icon-button" onClick={() => setNewList(false)}><X size={18} /></button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setNewList(true)}><Plus size={18} /> Add another list</button>
              )}
            </section>
          </div>
        </div>
      </DragDropContext>

      {selectedCard && (
        <CardModal
          card={cards.find((card) => card._id === selectedCard._id) || selectedCard}
          onClose={() => setSelectedCard(null)}
          onError={setError}
        />
      )}
    </section>
  );
}

function initials(name = "") {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function slug(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(date));
}
