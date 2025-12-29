// Client-side type definitions. These interfaces describe the shape of the
// data as it is received from the API, ensuring type safety in the UI.

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  collegeId: string;
  universityId?: string;
  role: Role;
  status: string;
  batch?: number;
  year?: number;
  createdAt: string; // Dates are strings over the API
}

export interface DesignStage {
  id: number;
  name: string;
}

export interface Resource {
  id: number;
  title: string;
  author: string;
  keywords: string[];
  batchYear?: number;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploader: User;
  designStage: DesignStage;
  status: "pending" | "approved" | "rejected" | "student";
  downloadCount: number;
  isArchived: boolean;
  priority: boolean;
  uploadedAt: string;
  adminComment?: string;
}

export interface Comment {
  id: number;
  text: string;
  user: User;
  createdAt: string;
}

export interface Flag {
  id: number;
  resourceId: number;
  resource: Resource;
  reporter: User;
  reason: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  userId: number;
  resourceId?: number;
  createdAt: string;
}
