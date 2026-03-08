import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DOCUMENT_TYPE_REPOSITORY } from '../../../shared/constants/repository.tokens';
import {
  UpdateDocumentTypeInput,
  DocumentTypeOutput,
} from '../../dtos/document-type.dto';
import type { DocumentTypeRepository } from 'src/domain/repositories/document-type.repository';

@Injectable()
export class UpdateDocumentTypeUseCase {
  constructor(
    @Inject(DOCUMENT_TYPE_REPOSITORY)
    private readonly documentTypeRepository: DocumentTypeRepository,
  ) {}

  async execute(
    id: string,
    input: UpdateDocumentTypeInput,
  ): Promise<DocumentTypeOutput> {
    const documentType = await this.documentTypeRepository.findById(id);

    if (!documentType) {
      throw new NotFoundException('Tipo de documento não encontrado');
    }

    if (input.name && input.name !== documentType.getName()) {
      const existing = await this.documentTypeRepository.findByName(input.name);
      if (existing) {
        throw new ConflictException(
          'Tipo de documento com este nome já existe',
        );
      }
    }

    documentType.update(
      input.name ?? documentType.getName(),
      input.description ?? documentType.getDescription() ?? undefined,
    );

    await this.documentTypeRepository.update(documentType);

    return {
      id: documentType.getId(),
      name: documentType.getName(),
      description: documentType.getDescription(),
      createdAt: documentType.getCreatedAt(),
    };
  }
}
