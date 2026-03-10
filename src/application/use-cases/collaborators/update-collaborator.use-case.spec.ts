import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateCollaboratorUseCase } from './update-collaborator.use-case';
import { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import { Collaborator } from '../../../domain/entities/collaborator.entity';

describe('UpdateCollaboratorUseCase', () => {
  let useCase: UpdateCollaboratorUseCase;
  let repository: jest.Mocked<CollaboratorRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new UpdateCollaboratorUseCase(repository);
  });

  it('deve atualizar o nome com sucesso', async () => {
    const collaborator = Collaborator.create('Lucas Cesar', 'lucas@email.com');
    repository.findById.mockResolvedValue(collaborator);
    repository.update.mockResolvedValue();

    const result = await useCase.execute(collaborator.getId(), {
      name: 'Lucas Atualizado',
    });

    expect(result.name).toBe('Lucas Atualizado');
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it('deve lançar NotFoundException se colaborador não existir', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('uuid-invalido', { name: 'Novo Nome' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve lançar ConflictException se novo email já estiver em uso', async () => {
    const collaborator = Collaborator.create('Lucas Cesar', 'lucas@email.com');
    const other = Collaborator.create('Outro', 'outro@email.com');

    repository.findById.mockResolvedValue(collaborator);
    repository.findByEmail.mockResolvedValue(other);

    await expect(
      useCase.execute(collaborator.getId(), { email: 'outro@email.com' }),
    ).rejects.toThrow(ConflictException);

    expect(repository.update).not.toHaveBeenCalled();
  });
});
