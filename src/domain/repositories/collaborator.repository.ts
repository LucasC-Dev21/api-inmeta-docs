import { Collaborator } from '../entities/collaborator.entity';

export interface CollaboratorRepository {
  create(collaborator: Collaborator): Promise<void>;
  update(collaborator: Collaborator): Promise<void>;
  findById(id: string): Promise<Collaborator | null>;
  findByEmail(email: string): Promise<Collaborator | null>;
  findAll(): Promise<Collaborator[]>;
}
