import { CreateCollaboratorUseCase } from './create-collaborator.use-case';
import { CollaboratorRepository } from '../../domain/repositories/collaborator.repository';
import { Collaborator } from '../../domain/entities/collaborator.entity';

describe('CreateCollaboratorUseCase', () => {
  let useCase: CreateCollaboratorUseCase;
  let repository: jest.Mocked<CollaboratorRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new CreateCollaboratorUseCase(repository);
  });

  it('deve criar um colaborador com sucesso', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.create.mockResolvedValue();

    const input = {
      name: 'Lucas Cesar',
      email: 'lucas@email.com',
    };

    const result = await useCase.execute(input);

    expect(repository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(repository.create).toHaveBeenCalledTimes(1);

    expect(result).toHaveProperty('id');
    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email.toLowerCase());
  });

  it('deve lançar erro se email já existir', async () => {
    const existing = Collaborator.create('Outro Nome', 'lucas@email.com');

    repository.findByEmail.mockResolvedValue(existing);

    const input = {
      name: 'Lucas Cesar',
      email: 'lucas@email.com',
    };

    await expect(useCase.execute(input)).rejects.toThrow(
      'Colaborador com este email já existe',
    );

    expect(repository.create).not.toHaveBeenCalled();
  });
});
