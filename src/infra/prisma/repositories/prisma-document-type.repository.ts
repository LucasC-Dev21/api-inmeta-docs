import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DocumentTypeRepository } from '../../../domain/repositories/document-type.repository';
import { DocumentType } from '../../../domain/entities/document-type.entity';

@Injectable()
export class PrismaDocumentTypeRepository implements DocumentTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(documentType: DocumentType): Promise<void> {
    await this.prisma.documentType.create({
      data: {
        id: documentType.getId(),
        name: documentType.getName(),
        description: documentType.getDescription(),
        createdAt: documentType.getCreatedAt(),
        updatedAt: documentType.getUpdatedAt(),
        deletedAt: documentType.getDeletedAt(),
      },
    });
  }

  async update(documentType: DocumentType): Promise<void> {
    await this.prisma.documentType.update({
      where: { id: documentType.getId() },
      data: {
        name: documentType.getName(),
        description: documentType.getDescription(),
        updatedAt: documentType.getUpdatedAt(),
        deletedAt: documentType.getDeletedAt(),
      },
    });
  }

  async findById(id: string): Promise<DocumentType | null> {
    const data = await this.prisma.documentType.findFirst({
      where: { id, deletedAt: null },
    });

    if (!data) return null;

    return DocumentType.restore({
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  async findByName(name: string): Promise<DocumentType | null> {
    const data = await this.prisma.documentType.findFirst({
      where: { name, deletedAt: null },
    });

    if (!data) return null;

    return DocumentType.restore({
      id: data.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  async findAll(): Promise<DocumentType[]> {
    const data = await this.prisma.documentType.findMany({
      where: { deletedAt: null },
    });

    return data.map((item) =>
      DocumentType.restore({
        id: item.id,
        name: item.name,
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      }),
    );
  }
}
