import { NotFoundException } from '@nestjs/common';
import { DeleteDocumentTypeUseCase } from './delete-document-type.use-case';
import { DocumentTypeRepository } from '../../../domain/repositories/document-type.repository';
import { DocumentType } from '../../../domain/entities/document-type.entity';

describe('DeleteDocumentTypeUseCase', () => {
  let useCase: DeleteDocumentTypeUseCase;
  let repository: jest.Mocked<DocumentTypeRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new DeleteDocumentTypeUseCase(repository);
  });

  it('deve fazer soft delete com sucesso', async () => {
    const documentType = DocumentType.create('CPF');
    repository.findById.mockResolvedValue(documentType);
    repository.update.mockResolvedValue();

    await useCase.execute(documentType.getId());

    expect(documentType.getDeletedAt()).not.toBeNull();
    expect(repository.update).toHaveBeenCalledTimes(1);
  });

  it('deve lançar NotFoundException se tipo de documento não existir', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute('uuid-invalido')).rejects.toThrow(
      NotFoundException,
    );
  });
});
