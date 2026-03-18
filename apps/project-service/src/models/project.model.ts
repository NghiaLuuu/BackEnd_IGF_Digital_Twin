export type ProjectModel = {
  projectId: string;
  name: string;
  description: string | null;
  createdBy: string;
  updatedBy: string;
};

export type ProjectItemModel = {
  projectId: string;
  name: string;
  description?: string;
  createdBy: string;
  updatedBy: string;
};
