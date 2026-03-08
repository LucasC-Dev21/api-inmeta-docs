import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOCUMENT_TYPE_REPOSITORY } from '../../../shared/constants/repository.tokens';
import { DocumentTypeOutput } from '../../dtos/document-type.dto';
import type { DocumentTypeRepository } from 'src/domain/repositories/document-type.repository';

@Injectable()
export class GetDocumentTypeUseCase {
  constructor(
    @Inject(DOCUMENT_TYPE_REPOSITORY)
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  async execute(id: string): Promise<DocumentTypeOutput> {
    const documentType = await this.documentTypeRepository.findById(id);

    if (!documentType) {
      throw new NotFoundException('Tipo de documento não encontrado');
    }

    return {
      id: documentType.getId(),
      name: documentType.getName(),
      description: documentType.getDescription(),
      createdAt: documentType.getCreatedAt(),
    };
  }
}
