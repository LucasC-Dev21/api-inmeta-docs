import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { DocumentRepository } from '../../../domain/repositories/document.repository';
import { DOCUMENT_REPOSITORY } from '../../../shared/constants/repository.tokens';

@Injectable()
export class GetDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: DocumentRepository,
  ) {}

  async execute(collaboratorId: string, documentTypeId: string) {
    const document = await this.documentRepository.findByCollaboratorAndType(
      collaboratorId,
      documentTypeId,
    );

    if (!document) throw new NotFoundException('Documento não encontrado');

    const activeVersion = document.getActiveVersion();

    return {
      id: document.getId(),
      collaboratorId: document.getCollaboratorId(),
      documentTypeId: document.getDocumentTypeId(),
      status: document.getStatus(),
      activeVersion: activeVersion
        ? {
            id: activeVersion.getId(),
            version: activeVersion.getVersion(),
            fileName: activeVersion.getFileName(),
            filePath: activeVersion.getFilePath(),
            mimeType: activeVersion.getMimeType(),
            createdAt: activeVersion.getCreatedAt(),
          }
        : null,
      history: document.getVersions().map((v) => ({
        id: v.getId(),
        version: v.getVersion(),
        fileName: v.getFileName(),
        isActive: v.getIsActive(),
        createdAt: v.getCreatedAt(),
      })),
      createdAt: document.getCreatedAt(),
    };
  }
}
