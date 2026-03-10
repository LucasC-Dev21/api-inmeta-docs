import { ConflictException, NotFoundException } from '@nestjs/common';
import { LinkCollaboratorDocumentTypeUseCase } from './link-collaborator-document-type.use-case';
import { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import { DocumentTypeRepository } from '../../../domain/repositories/document-type.repository';
import { CollaboratorDocumentTypeRepository } from '../../../domain/repositories/collaborator-document-type.repository';
import { Collaborator } from '../../../domain/entities/collaborator.entity';
import { DocumentType } from '../../../domain/entities/document-type.entity';

describe('LinkCollaboratorDocumentTypeUseCase', () => {
  let useCase: LinkCollaboratorDocumentTypeUseCase;
  let collaboratorRepository: jest.Mocked<CollaboratorRepository>;
  let documentTypeRepository: jest.Mocked<DocumentTypeRepository>;
  let linkRepository: jest.Mocked<CollaboratorDocumentTypeRepository>;
  let prisma: any;

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

    linkRepository = {
      link: jest.fn(),
      unlink: jest.fn(),
      findLink: jest.fn(),
      findByCollaborator: jest.fn(),
    };

    prisma = {
      $transaction: jest.fn().mockImplementation((cb) => cb(prisma)),
      collaboratorDocumentType: { create: jest.fn() },
      document: { create: jest.fn() },
    };

    useCase = new LinkCollaboratorDocumentTypeUseCase(
      collaboratorRepository,
      documentTypeRepository,
      linkRepository,
      prisma,
      prisma,
    );
  });

  it('deve vincular colaborador a tipo de documento com sucesso', async () => {
    const collaborator = Collaborator.create('Lucas', 'lucas@email.com');
    const documentType = DocumentType.create('CPF');

    collaboratorRepository.findById.mockResolvedValue(collaborator);
    documentTypeRepository.findById.mockResolvedValue(documentType);
    linkRepository.findLink.mockResolvedValue(false);

    await useCase.execute(collaborator.getId(), documentType.getId());

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('deve lançar NotFoundException se colaborador não existir', async () => {
    collaboratorRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('id', 'id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar NotFoundException se tipo de documento não existir', async () => {
    collaboratorRepository.findById.mockResolvedValue(
      Collaborator.create('Lucas', 'lucas@email.com'),
    );
    documentTypeRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('id', 'id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('deve lançar ConflictException se vínculo já existir', async () => {
    collaboratorRepository.findById.mockResolvedValue(
      Collaborator.create('Lucas', 'lucas@email.com'),
    );
    documentTypeRepository.findById.mockResolvedValue(
      DocumentType.create('CPF'),
    );
    linkRepository.findLink.mockResolvedValue(true);

    await expect(useCase.execute('id', 'id')).rejects.toThrow(
      ConflictException,
    );
  });
});
