import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// UI Store
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: 'light',
  notifications: [],
  loading: false,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { id: Date.now(), ...notification }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  setLoading: (loading) => set({ loading }),
}));

// Learning Store
export const useLearningStore = create((set) => ({
  currentStandard: null,
  currentSubject: null,
  currentChapter: null,
  standards: [],
  subjects: [],
  chapters: [],
  videos: [],
  tests: [],
  practiceProblems: [],
  
  setCurrentStandard: (standard) => set({ currentStandard: standard }),
  setCurrentSubject: (subject) => set({ currentSubject: subject }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  setStandards: (standards) => set({ standards }),
  setSubjects: (subjects) => set({ subjects }),
  setChapters: (chapters) => set({ chapters }),
  setVideos: (videos) => set({ videos }),
  setTests: (tests) => set({ tests }),
  setPracticeProblems: (practiceProblems) => set({ practiceProblems }),
  
  clearLearningData: () => set({
    currentStandard: null,
    currentSubject: null,
    currentChapter: null,
    subjects: [],
    chapters: [],
    videos: [],
    tests: [],
    practiceProblems: [],
  }),
}));

// Chat Store
export const useChatStore = create((set) => ({
  activeChat: null,
  messages: [],
  onlineUsers: [],
  
  setActiveChat: (chat) => set({ activeChat: chat }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  updateMessage: (messageId, content) => set((state) => ({
    messages: state.messages.map(m => m.id === messageId ? { ...m, content } : m)
  })),
  deleteMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(m => m.id !== messageId)
  })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
}));
