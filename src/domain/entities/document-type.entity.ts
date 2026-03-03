import { randomUUID } from 'crypto';

interface DocumentTypeProps {
  id?: string;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class DocumentType {
  private readonly id: string;
  private name: string;
  private description: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  private constructor(props: DocumentTypeProps) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  static create(name: string, description?: string): DocumentType {
    if (!name || name.trim().length < 2) {
      throw new Error('Nome do tipo de documento inválido');
    }

    return new DocumentType({
      name: name.trim(),
      description: description?.trim() ?? null,
    });
  }

  static restore(props: DocumentTypeProps): DocumentType {
    return new DocumentType(props);
  }

  update(name: string, description?: string) {
    if (!name || name.trim().length < 2) {
      throw new Error('Nome do tipo de documento inválido');
    }

    this.name = name.trim();
    this.description = description?.trim() ?? null;
    this.touch();
  }

  softDelete() {
    if (this.deletedAt) {
      throw new Error('Tipo de documento já removido');
    }

    this.deletedAt = new Date();
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getDeletedAt() {
    return this.deletedAt;
  }
}
