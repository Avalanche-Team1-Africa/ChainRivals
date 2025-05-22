import { create } from 'zustand';

export const useAIHelperStore = create((set) => ({
  // State
  isOpen: false,
  currentWidgets: [],
  widgetHistory: [],
  activeTab: 'chat',

  // Actions
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  closePanel: () => set({ isOpen: false }),
  openPanel: () => set({ isOpen: true }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  // Widget management
  addWidget: (widget) => set((state) => ({
    currentWidgets: [...state.currentWidgets, widget],
    widgetHistory: [...state.widgetHistory, widget]
  })),
  removeWidget: (widgetId) => set((state) => ({
    currentWidgets: state.currentWidgets.filter(w => w.id !== widgetId)
  })),
  clearWidgets: () => set({ currentWidgets: [] }),
  updateWidget: (widgetId, updates) => set((state) => ({
    currentWidgets: state.currentWidgets.map(w => 
      w.id === widgetId ? { ...w, ...updates } : w
    )
  })),

  // Helper functions to create common widget types
  createButtonWidget: (title, action) => ({
    id: `button_${Date.now()}`,
    type: 'button',
    title,
    action
  }),

  createCardWidget: (title, content) => ({
    id: `card_${Date.now()}`,
    type: 'card',
    title,
    content
  }),

  createFormWidget: (title, fields, onSubmit) => ({
    id: `form_${Date.now()}`,
    type: 'form',
    title,
    fields,
    onSubmit
  }),

  createChartWidget: (title, data) => ({
    id: `chart_${Date.now()}`,
    type: 'chart',
    title,
    data
  })
})); 