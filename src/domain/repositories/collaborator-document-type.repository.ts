export interface CollaboratorDocumentTypeRepository {
  link(collaboratorId: string, documentTypeId: string): Promise<void>;
  unlink(collaboratorId: string, documentTypeId: string): Promise<void>;
  findLink(collaboratorId: string, documentTypeId: string): Promise<boolean>;
  findByCollaborator(collaboratorId: string): Promise<string[]>;
}
