import { Inject, Injectable } from '@nestjs/common';
import type { DocumentRepository } from '../../../domain/repositories/document.repository';
import { DOCUMENT_REPOSITORY } from '../../../shared/constants/repository.tokens';

export interface ListPendingDocumentsInput {
  collaboratorId?: string;
  documentTypeId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ListPendingDocumentsUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: DocumentRepository,
  ) {}

  async execute(input: ListPendingDocumentsInput) {
    const page = input.page ?? 1;
    const limit = input.limit ?? 10;

    const { data, total } = await this.documentRepository.findPending({
      collaboratorId: input.collaboratorId,
      documentTypeId: input.documentTypeId,
      page,
      limit,
    });

    return {
      data: data.map((doc) => {
        const activeVersion = doc.getActiveVersion();
        return {
          id: doc.getId(),
          collaboratorId: doc.getCollaboratorId(),
          documentTypeId: doc.getDocumentTypeId(),
          status: doc.getStatus(),
          activeVersion: activeVersion
            ? {
                version: activeVersion.getVersion(),
                fileName: activeVersion.getFileName(),
                filePath: activeVersion.getFilePath(),
                mimeType: activeVersion.getMimeType(),
                createdAt: activeVersion.getCreatedAt(),
              }
            : null,
          createdAt: doc.getCreatedAt(),
        };
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
