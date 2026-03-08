import { DocumentType } from '../entities/document-type.entity';

export interface DocumentTypeRepository {
  create(documentType: DocumentType): Promise<void>;
  update(documentType: DocumentType): Promise<void>;
  findById(id: string): Promise<DocumentType | null>;
  findByName(name: string): Promise<DocumentType | null>;
  findAll(): Promise<DocumentType[]>;
}
