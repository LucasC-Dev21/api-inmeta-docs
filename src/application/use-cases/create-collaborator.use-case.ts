import { Inject, Injectable } from '@nestjs/common';
import { Collaborator } from '../../domain/entities/collaborator.entity';
import type { CollaboratorRepository } from '../../domain/repositories/collaborator.repository';
import {
  CreateCollaboratorInput,
  CreateCollaboratorOutput,
} from '../dtos/create-collaborator.dto';
import { COLLABORATOR_REPOSITORY } from '../../shared/constants/repository.tokens';

@Injectable()
export class CreateCollaboratorUseCase {
  constructor(
    @Inject(COLLABORATOR_REPOSITORY)
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
