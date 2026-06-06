import { create } from "zustand";
import { api } from "./api";

export const useAppStore = create((set, get) => ({
  user: null,
  workspaces: [],
  activeWorkspace: null,
  boards: [],
  activeBoard: null,
  lists: [],
  cards: [],
  loading: true,

  bootstrap: async () => {
    const token = localStorage.getItem("collabspace_token");
    if (!token) return set({ loading: false });
    try {
      const [{ data: auth }, { data: workspaceData }] = await Promise.all([
        api.get("/auth/me"),
        api.get("/workspaces"),
      ]);
      set({
        user: auth.user,
        workspaces: workspaceData.workspaces,
        loading: false,
      });
    } catch {
      localStorage.removeItem("collabspace_token");
      set({ user: null, loading: false });
    }
  },

  setSession: (token, user) => {
    localStorage.setItem("collabspace_token", token);
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("collabspace_token");
    set({
      user: null,
      workspaces: [],
      activeWorkspace: null,
      boards: [],
      activeBoard: null,
      lists: [],
      cards: [],
    });
  },

  loadWorkspaces: async () => {
    const { data } = await api.get("/workspaces");
    set({ workspaces: data.workspaces });
    return data.workspaces;
  },

  loadWorkspace: async (workspaceId) => {
    const { data } = await api.get(`/workspaces/${workspaceId}`);
    set({ activeWorkspace: data.workspace, boards: data.boards });
    return data;
  },

  loadBoard: async (boardId) => {
    const { data } = await api.get(`/boards/${boardId}`);
    set({
      activeBoard: data.board,
      lists: data.lists,
      cards: data.cards,
    });
  },

  addList: (list) =>
    set((state) => ({
      lists: state.lists.some((item) => item._id === list._id)
        ? state.lists
        : [...state.lists, list],
    })),
  updateList: (list) =>
    set((state) => ({
      lists: state.lists.map((item) => (item._id === list._id ? list : item)),
    })),
  removeList: (listId) =>
    set((state) => ({
      lists: state.lists.filter((list) => list._id !== listId),
      cards: state.cards.filter((card) => card.list !== listId),
    })),
  addCard: (card) =>
    set((state) => ({
      cards: state.cards.some((item) => item._id === card._id)
        ? state.cards
        : [...state.cards, card],
    })),
  updateCard: (card) =>
    set((state) => ({
      cards: state.cards.map((item) => (item._id === card._id ? card : item)),
    })),
  removeCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((card) => card._id !== cardId),
    })),

  reorderCards: (source, destination) => {
    const cards = [...get().cards];
    const sourceCards = cards
      .filter((card) => card.list === source.droppableId)
      .sort((a, b) => a.order - b.order);
    const [moved] = sourceCards.splice(source.index, 1);
    const destinationCards =
      source.droppableId === destination.droppableId
        ? sourceCards
        : cards
            .filter((card) => card.list === destination.droppableId)
            .sort((a, b) => a.order - b.order);
    moved.list = destination.droppableId;
    destinationCards.splice(destination.index, 0, moved);

    const affected = new Map();
    sourceCards.forEach((card, order) =>
      affected.set(card._id, { ...card, order }),
    );
    destinationCards.forEach((card, order) =>
      affected.set(card._id, {
        ...card,
        list: destination.droppableId,
        order,
      }),
    );
    const nextCards = cards.map((card) => affected.get(card._id) || card);
    set({ cards: nextCards });
    return [...affected.values()].map((card) => ({
      id: card._id,
      listId: card.list,
      order: card.order,
    }));
  },

  applyRemoteReorder: (updates) =>
    set((state) => {
      const byId = new Map(updates.map((item) => [item.id, item]));
      return {
        cards: state.cards.map((card) => {
          const update = byId.get(card._id);
          return update
            ? { ...card, list: update.listId, order: update.order }
            : card;
        }),
      };
    }),
}));
