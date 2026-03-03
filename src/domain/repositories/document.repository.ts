import { Document } from '../entities/document.entity';

export interface DocumentRepository {
  create(document: Document): Promise<void>;
  update(document: Document): Promise<void>;
  findById(id: string): Promise<Document | null>;
  findByCollaboratorId(collaboratorId: string): Promise<Document[]>;
  findPending(): Promise<Document[]>;
}
