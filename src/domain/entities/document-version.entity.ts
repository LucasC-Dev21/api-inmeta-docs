interface DocumentVersionProps {
  id?: string;
  version: number;
  fileName: string;
  filePath: string;
  mimeType?: string | null;
  createdAt?: Date;
  isActive?: boolean;
}

export class DocumentVersion {
  private readonly id: string;
  private readonly version: number;
  private readonly fileName: string;
  private readonly filePath: string;
  private readonly mimeType: string | null;
  private readonly createdAt: Date;
  private isActive: boolean;

  constructor(props: DocumentVersionProps) {
    if (props.version <= 0) {
      throw new Error('Versão inválida');
    }

    if (!props.fileName || !props.filePath) {
      throw new Error('Arquivo inválido');
    }

    this.id = props.id ?? crypto.randomUUID();
    this.version = props.version;
    this.fileName = props.fileName;
    this.filePath = props.filePath;
    this.mimeType = props.mimeType ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.isActive = props.isActive ?? true;
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }

  getId() {
    return this.id;
  }

  getVersion() {
    return this.version;
  }

  getFileName() {
    return this.fileName;
  }

  getFilePath() {
    return this.filePath;
  }

  getMimeType() {
    return this.mimeType;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getIsActive() {
    return this.isActive;
  }
}
