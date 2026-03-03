import { randomUUID } from 'crypto';
import { DocumentStatus } from '../enums/document-status.enum';
import { DocumentVersion } from './document-version.entity';

interface DocumentProps {
  id?: string;
  collaboratorId: string;
  documentTypeId: string;
  status?: DocumentStatus;
  versions?: DocumentVersion[];
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class Document {
  private readonly id: string;
  private readonly collaboratorId: string;
  private readonly documentTypeId: string;
  private status: DocumentStatus;
  private versions: DocumentVersion[];
  private readonly createdAt: Date;
  private deletedAt: Date | null;

  private constructor(props: DocumentProps) {
    if (!props.collaboratorId || !props.documentTypeId) {
      throw new Error('Documento inválido');
    }

    this.id = props.id ?? randomUUID();
    this.collaboratorId = props.collaboratorId;
    this.documentTypeId = props.documentTypeId;
    this.status = props.status ?? DocumentStatus.PENDING;
    this.versions = props.versions ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  static create(
    collaboratorId: string,
    documentTypeId: string,
    fileName: string,
    filePath: string,
    mimeType?: string,
  ): Document {
    const version = new DocumentVersion({
      version: 1,
      fileName,
      filePath,
      mimeType,
      isActive: true,
    });

    return new Document({
      collaboratorId,
      documentTypeId,
      versions: [version],
      status: DocumentStatus.PENDING,
    });
  }

  static restore(props: DocumentProps): Document {
    return new Document(props);
  }

  uploadNewVersion(fileName: string, filePath: string, mimeType?: string) {
    if (this.deletedAt) {
      throw new Error('Documento removido');
    }

    const currentVersion = this.getActiveVersion();

    if (!currentVersion) {
      throw new Error('Documento inconsistente');
    }

    currentVersion.deactivate();

    const newVersion = new DocumentVersion({
      version: currentVersion.getVersion() + 1,
      fileName,
      filePath,
      mimeType,
      isActive: true,
    });

    this.versions.push(newVersion);
    this.status = DocumentStatus.PENDING;
  }

  approve() {
    this.status = DocumentStatus.APPROVED;
  }

  reject() {
    this.status = DocumentStatus.REJECTED;
  }

  softDelete() {
    if (this.deletedAt) {
      throw new Error('Documento já removido');
    }

    this.deletedAt = new Date();
  }

  getActiveVersion(): DocumentVersion | undefined {
    return this.versions.find((v) => v.getIsActive());
  }

  getVersions(): DocumentVersion[] {
    return this.versions;
  }

  getId() {
    return this.id;
  }

  getCollaboratorId() {
    return this.collaboratorId;
  }

  getDocumentTypeId() {
    return this.documentTypeId;
  }

  getStatus() {
    return this.status;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getDeletedAt() {
    return this.deletedAt;
  }
}
