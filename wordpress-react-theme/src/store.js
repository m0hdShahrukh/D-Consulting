import { create } from 'zustand';

const initialSections = [
  {
    id: 'hero',
    name: 'Hero Section',
    widgets: []
  },
  {
    id: 'content',
    name: 'Content Section',
    widgets: []
  },
  {
    id: 'footer',
    name: 'Footer Section',
    widgets: []
  }
];

const createHistorySnapshot = (state) => ({
  sections: state.sections,
  selectedSectionId: state.selectedSectionId
});

export const useBuilderStore = create((set, get) => ({
  device: 'desktop',
  sections: initialSections,
  selectedSectionId: initialSections[0].id,
  history: [],
  future: [],
  setDevice: (device) => set({ device }),
  selectSection: (sectionId) => set({ selectedSectionId: sectionId }),
  addWidget: (widget) => {
    const state = get();
    const sections = state.sections.map((section) => {
      if (section.id !== state.selectedSectionId) {
        return section;
      }
      return {
        ...section,
        widgets: [
          ...section.widgets,
          {
            ...widget,
            instanceId: `${widget.key}-${Date.now()}`
          }
        ]
      };
    });

    set({
      sections,
      history: [...state.history, createHistorySnapshot(state)],
      future: []
    });
  },
  undo: () => {
    const state = get();
    if (state.history.length === 0) {
      return;
    }
    const previous = state.history[state.history.length - 1];
    set({
      sections: previous.sections,
      selectedSectionId: previous.selectedSectionId,
      history: state.history.slice(0, -1),
      future: [createHistorySnapshot(state), ...state.future]
    });
  },
  redo: () => {
    const state = get();
    if (state.future.length === 0) {
      return;
    }
    const next = state.future[0];
    set({
      sections: next.sections,
      selectedSectionId: next.selectedSectionId,
      history: [...state.history, createHistorySnapshot(state)],
      future: state.future.slice(1)
    });
  },
  get canUndo() {
    return get().history.length > 0;
  },
  get canRedo() {
    return get().future.length > 0;
  }
}));
