import { NotFoundException } from '@nestjs/common';
import { DeleteCollaboratorUseCase } from './delete-collaborator.use-case';
import { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import { Collaborator } from '../../../domain/entities/collaborator.entity';

describe('DeleteCollaboratorUseCase', () => {
  let useCase: DeleteCollaboratorUseCase;
  let repository: jest.Mocked<CollaboratorRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new DeleteCollaboratorUseCase(repository);
  });

  it('deve fazer soft delete com sucesso', async () => {
    const collaborator = Collaborator.create('Lucas Cesar', 'lucas@email.com');
    repository.findById.mockResolvedValue(collaborator);
    repository.update.mockResolvedValue();

    await useCase.execute(collaborator.getId());

    expect(collaborator.isDeleted()).toBe(true);
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it('deve lançar NotFoundException se colaborador não existir', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-invalido')).rejects.toThrow(
      NotFoundException,
    );
  });
});
