import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import type { DocumentTypeRepository } from '../../../domain/repositories/document-type.repository';
import type { DocumentRepository } from '../../../domain/repositories/document.repository';
import type { CollaboratorDocumentTypeRepository } from '../../../domain/repositories/collaborator-document-type.repository';
import { Document } from '../../../domain/entities/document.entity';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import {
  COLLABORATOR_REPOSITORY,
  DOCUMENT_TYPE_REPOSITORY,
  DOCUMENT_REPOSITORY,
  COLLABORATOR_DOCUMENT_TYPE_REPOSITORY,
} from '../../../shared/constants/repository.tokens';

export interface SubmitDocumentInput {
  collaboratorId: string;
  documentTypeId: string;
  fileName: string;
  filePath: string;
  mimeType?: string;
}

@Injectable()
export class SubmitDocumentUseCase {
  constructor(
    @Inject(COLLABORATOR_REPOSITORY)
    private readonly collaboratorRepository: CollaboratorRepository,
    @Inject(DOCUMENT_TYPE_REPOSITORY)
    private readonly documentTypeRepository: DocumentTypeRepository,
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: DocumentRepository,
    @Inject(COLLABORATOR_DOCUMENT_TYPE_REPOSITORY)
    private readonly linkRepository: CollaboratorDocumentTypeRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: SubmitDocumentInput) {
    const collaborator = await this.collaboratorRepository.findById(
      input.collaboratorId,
    );
    if (!collaborator)
      throw new NotFoundException('Colaborador não encontrado');

    const documentType = await this.documentTypeRepository.findById(
      input.documentTypeId,
    );
    if (!documentType)
      throw new NotFoundException('Tipo de documento não encontrado');

    const linked = await this.linkRepository.findLink(
      input.collaboratorId,
      input.documentTypeId,
    );
    if (!linked)
      throw new BadRequestException(
        'Colaborador não está vinculado a este tipo de documento',
      );

    const existing = await this.documentRepository.findByCollaboratorAndType(
      input.collaboratorId,
      input.documentTypeId,
    );

    if (existing) {
      // reenvio — nova versão
      await this.prisma.$transaction(async (tx) => {
        const activeVersion = existing.getActiveVersion();

        if (activeVersion) {
          await tx.documentVersion.update({
            where: { id: activeVersion.getId() },
            data: { isActive: false },
          });
        }

        const nextVersion = existing.getVersions().length + 1;

        await tx.documentVersion.create({
          data: {
            documentId: existing.getId(),
            version: nextVersion,
            fileName: input.fileName,
            filePath: input.filePath,
            mimeType: input.mimeType ?? null,
            isActive: true,
          },
        });
      });

      return {
        documentId: existing.getId(),
        version: existing.getVersions().length + 1,
      };
    }

    // primeiro envio
    const document = Document.create(
      input.collaboratorId,
      input.documentTypeId,
      input.fileName,
      input.filePath,
      input.mimeType,
    );

    await this.prisma.$transaction(async (tx) => {
      await tx.document.create({
        data: {
          id: document.getId(),
          collaboratorId: document.getCollaboratorId(),
          documentTypeId: document.getDocumentTypeId(),
          createdAt: document.getCreatedAt(),
        },
      });

      const version = document.getActiveVersion()!;

      await tx.documentVersion.create({
        data: {
          id: version.getId(),
          documentId: document.getId(),
          version: version.getVersion(),
          fileName: version.getFileName(),
          filePath: version.getFilePath(),
          mimeType: version.getMimeType() ?? null,
          isActive: true,
          createdAt: version.getCreatedAt(),
        },
      });
    });

    return { documentId: document.getId(), version: 1 };
  }
}
