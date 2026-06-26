export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  journalSuggestion?: {
    category: "thought" | "obsession" | "anxiety" | "fear";
    content: string;
    intensity: number;
  };
}

export interface JournalEntry {
  id: string;
  category: "thought" | "obsession" | "anxiety" | "fear";
  content: string;
  intensity: number; // 1-5
  timestamp: string;
  followUpAction?: string; // Follow up Action/Thought
}

export interface CloneProfile {
  name: string;
  avatarSeed: string;
  bio: string;
  traits: string[];
  speakingStyle: string;
  coreValues: string[];
  recommendedGreeting: string;
}

export interface UserSyncData {
  username: string;
  email: string;
  isPublic: boolean;
  syncedAt?: string;
}

export interface PublicClone {
  username: string;
  name: string;
  avatarSeed: string;
  bio: string;
  traits: string[];
  speakingStyle: string;
  coreValues: string[];
  recommendedGreeting: string;
}
