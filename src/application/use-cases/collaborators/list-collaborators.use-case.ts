import { Inject, Injectable } from '@nestjs/common';
import type { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import { COLLABORATOR_REPOSITORY } from '../../../shared/constants/repository.tokens';

@Injectable()
export class ListCollaboratorsUseCase {
  constructor(
    @Inject(COLLABORATOR_REPOSITORY)
    private readonly collaboratorRepository: CollaboratorRepository,
  ) {}

  async execute() {
    const collaborators = await this.collaboratorRepository.findAll();

    return collaborators.map((c) => ({
      id: c.getId(),
      name: c.getName(),
      email: c.getEmail(),
      createdAt: c.getCreatedAt(),
    }));
  }
}
