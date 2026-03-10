import { Document } from '../entities/document.entity';

export interface DocumentRepository {
  create(document: Document): Promise<void>;
  findByCollaboratorAndType(
    collaboratorId: string,
    documentTypeId: string,
  ): Promise<Document | null>;
  findPending(params: {
    collaboratorId?: string;
    documentTypeId?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Document[]; total: number }>;
}
