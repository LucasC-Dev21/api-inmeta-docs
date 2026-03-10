import { ConflictException } from '@nestjs/common';
import { CreateDocumentTypeUseCase } from './create-document-type.use-case';
import { DocumentTypeRepository } from '../../../domain/repositories/document-type.repository';
import { DocumentType } from '../../../domain/entities/document-type.entity';

describe('CreateDocumentTypeUseCase', () => {
  let useCase: CreateDocumentTypeUseCase;
  let repository: jest.Mocked<DocumentTypeRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new CreateDocumentTypeUseCase(repository);
  });

  it('deve criar um tipo de documento com sucesso', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue();

    const result = await useCase.execute({
      name: 'CPF',
      description: 'Cadastro de Pessoa Física',
    });

    expect(result).toHaveProperty('id');
    expect(result.name).toBe('CPF');
    expect(result.description).toBe('Cadastro de Pessoa Física');
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('deve lançar ConflictException se nome já existir', async () => {
    const existing = DocumentType.create('CPF');
    repository.findByName.mockResolvedValue(existing);

    await expect(useCase.execute({ name: 'CPF' })).rejects.toThrow(
      ConflictException,
    );

    expect(repository.create).not.toHaveBeenCalled();
  });
});
