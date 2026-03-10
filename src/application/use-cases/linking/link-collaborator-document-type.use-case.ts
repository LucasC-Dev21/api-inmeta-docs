import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import type { DocumentTypeRepository } from '../../../domain/repositories/document-type.repository';
import type { CollaboratorDocumentTypeRepository } from '../../../domain/repositories/collaborator-document-type.repository';
import { Document } from '../../../domain/entities/document.entity';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import {
  COLLABORATOR_REPOSITORY,
  COLLABORATOR_DOCUMENT_TYPE_REPOSITORY,
  DOCUMENT_TYPE_REPOSITORY,
} from '../../../shared/constants/repository.tokens';

@Injectable()
export class LinkCollaboratorDocumentTypeUseCase {
  constructor(
    @Inject(COLLABORATOR_REPOSITORY)
    private readonly collaboratorRepository: CollaboratorRepository,
    @Inject(DOCUMENT_TYPE_REPOSITORY)
    private readonly documentTypeRepository: DocumentTypeRepository,
    @Inject(COLLABORATOR_DOCUMENT_TYPE_REPOSITORY)
    private readonly linkRepository: CollaboratorDocumentTypeRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(collaboratorId: string, documentTypeId: string): Promise<void> {
    const collaborator =
      await this.collaboratorRepository.findById(collaboratorId);
    if (!collaborator)
      throw new NotFoundException('Colaborador não encontrado');

    const documentType =
      await this.documentTypeRepository.findById(documentTypeId);
    if (!documentType)
      throw new NotFoundException('Tipo de documento não encontrado');

    const alreadyLinked = await this.linkRepository.findLink(
      collaboratorId,
      documentTypeId,
    );
    if (alreadyLinked) throw new ConflictException('Vínculo já existe');

    await this.prisma.$transaction(async (tx) => {
      await tx.collaboratorDocumentType.create({
        data: { collaboratorId, documentTypeId },
      });

      const document = Document.createPending(collaboratorId, documentTypeId);

      await tx.document.create({
        data: {
          id: document.getId(),
          collaboratorId: document.getCollaboratorId(),
          documentTypeId: document.getDocumentTypeId(),
          createdAt: document.getCreatedAt(),
        },
      });
    });
  }
}
