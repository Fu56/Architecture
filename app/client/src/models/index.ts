// Client-side type definitions. These interfaces describe the shape of the
// data as it is received from the API, ensuring type safety in the UI.

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  university_id?: string;
  universityId?: string;
  role: Role | string;
  status: string;
  batch?: number;
  year?: number;
  createdAt?: string;
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
  semester?: number;
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
  averageRating?: number;
  ratingCount?: number;
  isFavorite?: boolean;
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
  is_read: boolean;
  user_id: string;
  resource_id?: number;
  assignment_id?: number;
  resource?: { title: string };
  created_at: string;
}

export interface Assignment {
  id: number;
  title: string;
  description?: string;
  due_date?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  creator: {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
  };
  design_stage?: DesignStage;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  image_path?: string;
  published: boolean;
  tags: string[];
  author: User;
  created_at: string;
  updated_at: string;
}
