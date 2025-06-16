
export type ReportPlatform = 'LookerStudio' | 'Tableau';

export interface Report {
  id: string;
  title: string;
  description: string; // Initial description, can be updated by AI
  url: string;
  platform: ReportPlatform;
  category: string;
  tags?: string[];
  imageUrl: string; // Placeholder image URL
  aiSummary?: string; // To store AI generated summary
}
