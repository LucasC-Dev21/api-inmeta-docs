import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SubmitDocumentUseCase } from './submit-document.use-case';
import { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import { DocumentTypeRepository } from '../../../domain/repositories/document-type.repository';
import { DocumentRepository } from '../../../domain/repositories/document.repository';
import { CollaboratorDocumentTypeRepository } from '../../../domain/repositories/collaborator-document-type.repository';
import { Collaborator } from '../../../domain/entities/collaborator.entity';
import { DocumentType } from '../../../domain/entities/document-type.entity';

describe('SubmitDocumentUseCase', () => {
  let useCase: SubmitDocumentUseCase;
  let collaboratorRepository: jest.Mocked<CollaboratorRepository>;
  let documentTypeRepository: jest.Mocked<DocumentTypeRepository>;
  let documentRepository: jest.Mocked<DocumentRepository>;
  let linkRepository: jest.Mocked<CollaboratorDocumentTypeRepository>;
  let prisma: any;

  const input = {
    collaboratorId: 'collab-id',
    documentTypeId: 'doctype-id',
    fileName: 'cpf.pdf',
    filePath: '/docs/cpf.pdf',
    mimeType: 'application/pdf',
  };

  beforeEach(() => {
    collaboratorRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
    };

    documentTypeRepository = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
    };

    documentRepository = {
      create: jest.fn(),
      findByCollaboratorAndType: jest.fn(),
      findPending: jest.fn(),
    };

    linkRepository = {
      link: jest.fn(),
      unlink: jest.fn(),
      findLink: jest.fn(),
      findByCollaborator: jest.fn(),
    };

    prisma = {
      $transaction: jest.fn((cb) => cb(prisma)),
      document: { create: jest.fn() },
      documentVersion: { create: jest.fn(), update: jest.fn() },
    };

    useCase = new SubmitDocumentUseCase(
      collaboratorRepository,
      documentTypeRepository,
      documentRepository,
      linkRepository,
      prisma,
    );
  });

  it('deve enviar documento com sucesso (primeiro envio)', async () => {
    collaboratorRepository.findById.mockResolvedValue(
      Collaborator.create('Lucas', 'lucas@email.com'),
    );
    documentTypeRepository.findById.mockResolvedValue(
      DocumentType.create('CPF'),
    );
    linkRepository.findLink.mockResolvedValue(true);
    documentRepository.findByCollaboratorAndType.mockResolvedValue(null);

    const result = await useCase.execute(input);

    expect(result).toHaveProperty('documentId');
    expect(result.version).toBe(1);
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('deve lançar NotFoundException se colaborador não existir', async () => {
    collaboratorRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar NotFoundException se tipo de documento não existir', async () => {
    collaboratorRepository.findById.mockResolvedValue(
      Collaborator.create('Lucas', 'lucas@email.com'),
    );
    documentTypeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(NotFoundException);
  });

  it('deve lançar BadRequestException se colaborador não estiver vinculado', async () => {
    collaboratorRepository.findById.mockResolvedValue(
      Collaborator.create('Lucas', 'lucas@email.com'),
    );
    documentTypeRepository.findById.mockResolvedValue(
      DocumentType.create('CPF'),
    );
    linkRepository.findLink.mockResolvedValue(false);

    await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
  });
});
