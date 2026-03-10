import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import { COLLABORATOR_REPOSITORY } from '../../../shared/constants/repository.tokens';

export interface UpdateCollaboratorInput {
  name?: string;
  email?: string;
}

@Injectable()
export class UpdateCollaboratorUseCase {
  constructor(
    @Inject(COLLABORATOR_REPOSITORY)
    private readonly collaboratorRepository: CollaboratorRepository,
  ) {}

  async execute(id: string, input: UpdateCollaboratorInput) {
    const collaborator = await this.collaboratorRepository.findById(id);

    if (!collaborator) {
      throw new NotFoundException('Colaborador não encontrado');
    }

    if (input.email && input.email !== collaborator.getEmail()) {
      const existing = await this.collaboratorRepository.findByEmail(
        input.email,
      );
      if (existing) {
        throw new ConflictException('Email já está em uso');
      }
      collaborator.changeEmail(input.email);
    }

    if (input.name) {
      collaborator.updateName(input.name);
    }

    await this.collaboratorRepository.update(collaborator);

    return {
      id: collaborator.getId(),
      name: collaborator.getName(),
      email: collaborator.getEmail(),
      updatedAt: collaborator.getUpdatedAt(),
    };
  }
}
