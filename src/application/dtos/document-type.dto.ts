export interface CreateDocumentTypeInput {
  name: string;
  description?: string;
}

export interface UpdateDocumentTypeInput {
  name?: string;
  description?: string;
}

export interface DocumentTypeOutput {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
}
