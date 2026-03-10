import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import { COLLABORATOR_REPOSITORY } from '../../../shared/constants/repository.tokens';

@Injectable()
export class DeleteCollaboratorUseCase {
  constructor(
    @Inject(COLLABORATOR_REPOSITORY)
    private readonly collaboratorRepository: CollaboratorRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const collaborator = await this.collaboratorRepository.findById(id);

    if (!collaborator) {
      throw new NotFoundException('Colaborador não encontrado');
    }

    collaborator.softDelete();

    await this.collaboratorRepository.update(collaborator);
  }
}
