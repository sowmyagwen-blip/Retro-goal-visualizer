export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 to 100
  totalSteps: number;
  currentSteps: number;
  category: 'Sitcom' | 'News' | 'Drama' | 'Sports' | 'Documentary';
}

export enum AppView {
  GUIDE = 'GUIDE',
  CHANNEL = 'CHANNEL',
  CREATE = 'CREATE',
}

export interface TVState {
  isOn: boolean;
  volume: number; // 0 to 10
  currentChannelIndex: number; // Corresponds to Goal index
  view: AppView;
  isMuted: boolean;
}
