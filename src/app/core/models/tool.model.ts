export type ToolCategoryId = 'images' | 'media' | 'text' | 'developer-tools' | 'generators';

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  description: string;
  icon: string;
  color?: string;
}

export interface ToolInstruction {
  title: string;
  steps: string[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategoryId;
  icon: string;
  route: string;
  keywords: string[];
  isFeatured?: boolean;
  badge?: string;
  privacyNote: string;
  instructions: ToolInstruction;
  relatedToolIds: string[];
}
