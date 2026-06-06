import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Layers3,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { api, errorMessage } from "../api";
import { useAppStore } from "../store";
import Board from "./Board";

export default function WorkspacePage() {
  const {
    user,
    workspaces,
    activeWorkspace,
    boards,
    activeBoard,
    loadWorkspaces,
    loadWorkspace,
    loadBoard,
    logout,
  } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBoardCreate, setShowBoardCreate] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState("");
  const [newBoard, setNewBoard] = useState("");
  const [settings, setSettings] = useState({ name: "", description: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function start() {
      const items = workspaces.length ? workspaces : await loadWorkspaces();
      if (items[0]) {
        const data = await loadWorkspace(items[0]._id);
        if (data.boards[0]) await loadBoard(data.boards[0]._id);
      }
    }
    start().catch((requestError) => setError(errorMessage(requestError)));
  }, []);

  async function chooseWorkspace(workspaceId) {
    const data = await loadWorkspace(workspaceId);
    if (data.boards[0]) await loadBoard(data.boards[0]._id);
    setSidebarOpen(false);
  }

  function openSettings() {
    setSettings({
      name: activeWorkspace.name,
      description: activeWorkspace.description || "",
    });
    setInviteToken("");
    setShowSettings(true);
  }

  async function saveSettings(event) {
    event.preventDefault();
    try {
      await api.patch(`/workspaces/${activeWorkspace._id}`, settings);
      await loadWorkspace(activeWorkspace._id);
      setShowSettings(false);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function inviteMember(event) {
    event.preventDefault();
    try {
      const { data } = await api.post(
        `/workspaces/${activeWorkspace._id}/invitations`,
        { email: inviteEmail, role: "member" },
      );
      setInviteToken(data.invitation.token);
      setInviteEmail("");
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function createBoard(event) {
    event.preventDefault();
    try {
      const { data } = await api.post(
        `/workspaces/${activeWorkspace._id}/boards`,
        { name: newBoard },
      );
      await loadWorkspace(activeWorkspace._id);
      await loadBoard(data.board._id);
      setNewBoard("");
      setShowBoardCreate(false);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  async function createWorkspace(event) {
    event.preventDefault();
    try {
      const { data } = await api.post("/workspaces", { name: newWorkspace });
      await loadWorkspaces();
      await loadWorkspace(data.workspace._id);
      await loadBoard(data.board._id);
      setNewWorkspace("");
      setShowCreate(false);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }

  if (!workspaces.length && !activeWorkspace) {
    return (
      <div className="empty-onboarding">
        <span className="brand-mark large"><Layers3 /></span>
        <h1>Create your first workspace</h1>
        <p>Bring projects, boards, and teammates into one organized place.</p>
        <form onSubmit={createWorkspace} className="create-inline">
          <input
            value={newWorkspace}
            onChange={(event) => setNewWorkspace(event.target.value)}
            placeholder="e.g. Acme Product"
            required
          />
          <button className="button button-primary">Create workspace</button>
        </form>
        {error && <div className="form-error">{error}</div>}
      </div>
    );
  }

  return (
    <div className="workspace-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <a className="brand" href="/">
            <span className="brand-mark"><Layers3 size={19} /></span>
            CollabSpace
          </a>
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <button className="workspace-picker">
          <span className="workspace-avatar">
            {activeWorkspace?.name?.slice(0, 2).toUpperCase()}
          </span>
          <span>
            <strong>{activeWorkspace?.name}</strong>
            <small>{activeWorkspace?.members?.length || 1} members</small>
          </span>
          <ChevronDown size={16} />
        </button>

        <nav className="main-nav">
          <button className="active"><LayoutDashboard size={18} /> Boards</button>
          <button onClick={openSettings}><Users size={18} /> Members</button>
          <button onClick={openSettings}><Settings size={18} /> Workspace settings</button>
        </nav>

        <div className="sidebar-section">
          <div className="section-heading">
            <span>Your boards</span>
            <button className="icon-button" title="New board" onClick={() => setShowBoardCreate(true)}><Plus size={16} /></button>
          </div>
          {boards.map((board) => (
            <button
              key={board._id}
              className={`board-link ${activeBoard?._id === board._id ? "active" : ""}`}
              onClick={() => loadBoard(board._id)}
            >
              <span style={{ background: board.color }} />
              {board.name}
            </button>
          ))}
        </div>

        <div className="sidebar-section workspace-list">
          <div className="section-heading"><span>Workspaces</span></div>
          {workspaces.map((workspace) => (
            <button
              key={workspace._id}
              className={activeWorkspace?._id === workspace._id ? "selected" : ""}
              onClick={() => chooseWorkspace(workspace._id)}
            >
              {workspace.name}
            </button>
          ))}
          <button className="new-workspace" onClick={() => setShowCreate(true)}>
            <Plus size={15} /> New workspace
          </button>
        </div>

        <button className="sidebar-user" onClick={logout}>
          <span className="user-avatar" style={{ background: user.avatarColor }}>
            {initials(user.name)}
          </span>
          <span><strong>{user.name}</strong><small>{user.email}</small></span>
          <LogOut size={16} />
        </button>
      </aside>

      <main className="workspace-main">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)}>
            <Menu size={21} />
          </button>
          <div className="global-search">
            <Search size={17} />
            <input placeholder="Search cards, boards, and people..." />
            <kbd>⌘ K</kbd>
          </div>
          <div className="topbar-actions">
            <button className="icon-button"><CircleHelp size={19} /></button>
            <button className="icon-button notification"><Bell size={19} /><i /></button>
            <span className="user-avatar small" style={{ background: user.avatarColor }}>
              {initials(user.name)}
            </span>
          </div>
        </header>
        {error && <div className="page-error">{error}</div>}
        {activeBoard ? <Board /> : <div className="board-loading">Select a board</div>}
      </main>

      {sidebarOpen && <button className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}
      {showCreate && (
        <div className="modal-backdrop" onMouseDown={() => setShowCreate(false)}>
          <form className="modal compact-modal" onSubmit={createWorkspace} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div><h2>New workspace</h2><p>Create a home for a team or project.</p></div>
              <button type="button" className="icon-button" onClick={() => setShowCreate(false)}><X /></button>
            </div>
            <label>Workspace name<input autoFocus value={newWorkspace} onChange={(e) => setNewWorkspace(e.target.value)} required /></label>
            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="button button-primary">Create workspace</button>
            </div>
          </form>
        </div>
      )}
      {showBoardCreate && (
        <div className="modal-backdrop" onMouseDown={() => setShowBoardCreate(false)}>
          <form className="modal compact-modal" onSubmit={createBoard} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div><h2>Create a board</h2><p>Start a new workflow in {activeWorkspace.name}.</p></div>
              <button type="button" className="icon-button" onClick={() => setShowBoardCreate(false)}><X /></button>
            </div>
            <label>Board name<input autoFocus value={newBoard} onChange={(e) => setNewBoard(e.target.value)} placeholder="e.g. Q3 Launch" required /></label>
            <div className="modal-actions">
              <button type="button" className="button button-secondary" onClick={() => setShowBoardCreate(false)}>Cancel</button>
              <button className="button button-primary">Create board</button>
            </div>
          </form>
        </div>
      )}
      {showSettings && (
        <div className="modal-backdrop" onMouseDown={() => setShowSettings(false)}>
          <div className="modal settings-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div><span className="modal-kicker">WORKSPACE</span><h2>Settings and members</h2></div>
              <button type="button" className="icon-button" onClick={() => setShowSettings(false)}><X /></button>
            </div>
            <form onSubmit={saveSettings}>
              <label>Workspace name<input value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} required /></label>
              <label>Description<textarea rows="3" value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} placeholder="What is this workspace for?" /></label>
              <div className="settings-save"><button className="button button-primary">Save workspace</button></div>
            </form>
            <div className="invite-section">
              <h3>Invite a teammate</h3>
              <p>Invitations expire after seven days and are restricted to the invited email.</p>
              <form className="invite-form" onSubmit={inviteMember}>
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="teammate@company.com" required />
                <button className="button button-secondary">Create invite</button>
              </form>
              {inviteToken && (
                <div className="invite-result">
                  Invite token created: <code>{inviteToken}</code>
                </div>
              )}
              <div className="member-list">
                {activeWorkspace.members?.map((membership) => (
                  <div key={membership._id}>
                    <span className="user-avatar small" style={{ background: membership.user.avatarColor }}>{initials(membership.user.name)}</span>
                    <span><strong>{membership.user.name}</strong><small>{membership.user.email}</small></span>
                    <em>{membership.role}</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function initials(name = "") {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
