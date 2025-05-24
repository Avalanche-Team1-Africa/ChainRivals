import { create } from 'zustand';

export const useAIHelperStore = create((set) => ({
  // State
  isOpen: false,
  currentWidgets: [],
  widgetHistory: [],
  activeTab: 'chat',
  isLoading: false,
  error: null,
  chatMessages: [],
  currentMessage: '',

  // Actions
  togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
  closePanel: () => set({ isOpen: false }),
  openPanel: () => set({ isOpen: true }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Chat actions
  setCurrentMessage: (message) => set({ currentMessage: message }),
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
    currentMessage: ''
  })),
  clearChat: () => set({ chatMessages: [] }),
  
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

  createFormWidget: ({ title, fields, onSubmit }) => ({
    id: `form_${Date.now()}`,
    type: 'form',
    title,
    fields,
    onSubmit,
    state: {
      values: {},
      errors: {},
      isSubmitting: false
    }
  }),

  createChartWidget: (title, data) => ({
    id: `chart_${Date.now()}`,
    type: 'chart',
    title,
    data
  }),

  // New widget types
  createCodeWidget: (title, code, language = 'javascript') => ({
    id: `code_${Date.now()}`,
    type: 'code',
    title,
    code,
    language
  }),

  createProgressWidget: (title, status, progress) => ({
    id: `progress_${Date.now()}`,
    type: 'progress',
    title,
    status,
    progress
  }),

  createAlertWidget: (title, message, type = 'info') => ({
    id: `alert_${Date.now()}`,
    type: 'alert',
    title,
    message,
    alertType: type // 'info', 'success', 'warning', 'error'
  }),

  createListWidget: (title, items, type = 'unordered') => ({
    id: `list_${Date.now()}`,
    type: 'list',
    title,
    items,
    listType: type // 'ordered', 'unordered'
  }),

  createChatWidget: () => ({
    id: `chat_${Date.now()}`,
    type: 'chat'
  })
})); 