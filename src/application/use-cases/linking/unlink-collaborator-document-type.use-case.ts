import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import type { DocumentTypeRepository } from '../../../domain/repositories/document-type.repository';
import type { CollaboratorDocumentTypeRepository } from '../../../domain/repositories/collaborator-document-type.repository';
import {
  COLLABORATOR_REPOSITORY,
  COLLABORATOR_DOCUMENT_TYPE_REPOSITORY,
  DOCUMENT_TYPE_REPOSITORY,
} from '../../../shared/constants/repository.tokens';

@Injectable()
export class UnlinkCollaboratorDocumentTypeUseCase {
  constructor(
    @Inject(COLLABORATOR_REPOSITORY)
    private readonly collaboratorRepository: CollaboratorRepository,
    @Inject(DOCUMENT_TYPE_REPOSITORY)
    private readonly documentTypeRepository: DocumentTypeRepository,
    @Inject(COLLABORATOR_DOCUMENT_TYPE_REPOSITORY)
    private readonly linkRepository: CollaboratorDocumentTypeRepository,
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

    const linked = await this.linkRepository.findLink(
      collaboratorId,
      documentTypeId,
    );
    if (!linked) throw new NotFoundException('Vínculo não encontrado');

    await this.linkRepository.unlink(collaboratorId, documentTypeId);
  }
}
