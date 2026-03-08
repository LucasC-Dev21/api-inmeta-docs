import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { DocumentType } from '../../../domain/entities/document-type.entity';
import { DOCUMENT_TYPE_REPOSITORY } from '../../../shared/constants/repository.tokens';
import {
  CreateDocumentTypeInput,
  DocumentTypeOutput,
} from '../../dtos/document-type.dto';
import type { DocumentTypeRepository } from 'src/domain/repositories/document-type.repository';

@Injectable()
export class CreateDocumentTypeUseCase {
  constructor(
    @Inject(DOCUMENT_TYPE_REPOSITORY)
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  async execute(input: CreateDocumentTypeInput): Promise<DocumentTypeOutput> {
    const existing = await this.documentTypeRepository.findByName(input.name);

    if (existing) {
      throw new ConflictException('Tipo de documento com este nome já existe');
    }

    const documentType = DocumentType.create(input.name, input.description);

    await this.documentTypeRepository.create(documentType);

    return {
      id: documentType.getId(),
      name: documentType.getName(),
      description: documentType.getDescription(),
      createdAt: documentType.getCreatedAt(),
    };
  }
}
