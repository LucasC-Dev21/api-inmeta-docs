import { Collaborator } from '../../domain/entities/collaborator.entity';
import { CollaboratorRepository } from '../../domain/repositories/collaborator.repository';
import {
  CreateCollaboratorInput,
  CreateCollaboratorOutput,
} from '../dtos/create-collaborator.dto';

export class CreateCollaboratorUseCase {
  constructor(
    private readonly collaboratorRepository: CollaboratorRepository,
  ) {}

  async execute(
    input: CreateCollaboratorInput,
  ): Promise<CreateCollaboratorOutput> {
    const existing = await this.collaboratorRepository.findByEmail(input.email);

    if (existing) {
      throw new Error('Colaborador com este email já existe');
    }

    const collaborator = Collaborator.create(input.name, input.email);

    await this.collaboratorRepository.create(collaborator);

    return {
      id: collaborator.getId(),
      name: collaborator.getName(),
      email: collaborator.getEmail(),
    };
  }
}
