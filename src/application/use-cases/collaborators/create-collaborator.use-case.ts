import { Inject, Injectable } from '@nestjs/common';
import {
  CreateCollaboratorInput,
  CreateCollaboratorOutput,
} from 'src/application/dtos/create-collaborator.dto';
import { Collaborator } from 'src/domain/entities/collaborator.entity';
import type { CollaboratorRepository } from 'src/domain/repositories/collaborator.repository';
import { COLLABORATOR_REPOSITORY } from 'src/shared/constants/repository.tokens';

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
      throw new Error('Já existe um colaborador cadastrado com esse email');
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
