import { randomUUID } from 'crypto';
import { Email } from '../value-objects/email.vo';

interface CollaboratorProps {
  id?: string;
  name: string;
  email: Email;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Collaborator {
  private readonly id: string;
  private name: string;
  private email: Email;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;

  private constructor(props: CollaboratorProps) {
    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  static create(name: string, email: string): Collaborator {
    if (!name || name.trim().length < 3) {
      throw new Error('Nome inválido');
    }

    const emailVO = Email.create(email);

    return new Collaborator({
      name: name.trim(),
      email: emailVO,
    });
  }

  static restore(props: CollaboratorProps): Collaborator {
    return new Collaborator(props);
  }

  updateName(name: string) {
    if (!name || name.trim().length < 3) {
      throw new Error('Nome inválido');
    }

    this.name = name.trim();
    this.touch();
  }

  changeEmail(email: string) {
    this.email = Email.create(email);
    this.touch();
  }

  softDelete() {
    if (this.deletedAt) {
      throw new Error('Colaborador já está removido');
    }

    this.deletedAt = new Date();
    this.touch();
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
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

  getEmail() {
    return this.email.getValue();
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
