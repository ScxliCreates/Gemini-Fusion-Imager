
export enum WorkflowStatus {
  IDLE,
  QUICK_DRAFTING,
  PLANNING,
  DRAFTING,
  ANALYZING,
  REFINING,
  COMPLETED,
  ERROR,
}

export interface ImageFile {
  base64: string;
  mimeType: string;
}