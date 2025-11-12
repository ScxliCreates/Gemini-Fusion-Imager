
export enum WorkflowStatus {
  IDLE,
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
