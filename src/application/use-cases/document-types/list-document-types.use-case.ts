import { Inject, Injectable } from '@nestjs/common';
import { DOCUMENT_TYPE_REPOSITORY } from '../../../shared/constants/repository.tokens';
import { DocumentTypeOutput } from '../../dtos/document-type.dto';
import type { DocumentTypeRepository } from 'src/domain/repositories/document-type.repository';

@Injectable()
export class ListDocumentTypesUseCase {
  constructor(
    @Inject(DOCUMENT_TYPE_REPOSITORY)
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  async execute(): Promise<DocumentTypeOutput[]> {
    const documentTypes = await this.documentTypeRepository.findAll();

    return documentTypes.map((dt) => ({
      id: dt.getId(),
      name: dt.getName(),
      description: dt.getDescription(),
      createdAt: dt.getCreatedAt(),
    }));
  }
}
