import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DocumentRepository } from '../../../domain/repositories/document.repository';
import { Document } from '../../../domain/entities/document.entity';
import { DocumentVersion } from '../../../domain/entities/document-version.entity';
import { DocumentStatus } from '../../../domain/enums/document-status.enum';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(document: Document): Promise<void> {
    await this.prisma.document.create({
      data: {
        id: document.getId(),
        collaboratorId: document.getCollaboratorId(),
        documentTypeId: document.getDocumentTypeId(),
        createdAt: document.getCreatedAt(),
        deletedAt: document.getDeletedAt(),
        versions: {
          create: document.getVersions().map((v) => ({
            id: v.getId(),
            version: v.getVersion(),
            fileName: v.getFileName(),
            filePath: v.getFilePath(),
            mimeType: v.getMimeType(),
            isActive: v.getIsActive(),
            createdAt: v.getCreatedAt(),
          })),
        },
      },
    });
  }

  async findByCollaboratorAndType(
    collaboratorId: string,
    documentTypeId: string,
  ): Promise<Document | null> {
    const data = await this.prisma.document.findFirst({
      where: { collaboratorId, documentTypeId, deletedAt: null },
      include: { versions: true },
    });

    if (!data) return null;

    return Document.restore({
      id: data.id,
      collaboratorId: data.collaboratorId,
      documentTypeId: data.documentTypeId,
      status: data.versions.some((v) => v.isActive)
        ? DocumentStatus.PENDING
        : DocumentStatus.PENDING,
      versions: data.versions.map(
        (v) =>
          new DocumentVersion({
            id: v.id,
            version: v.version,
            fileName: v.fileName,
            filePath: v.filePath,
            mimeType: v.mimeType,
            isActive: v.isActive,
            createdAt: v.createdAt,
          }),
      ),
      createdAt: data.createdAt,
      deletedAt: data.deletedAt,
    });
  }

  async findPending(params: {
    collaboratorId?: string;
    documentTypeId?: string;
    page: number;
    limit: number;
  }): Promise<{ data: Document[]; total: number }> {
    const where = {
      deletedAt: null,
      ...(params.collaboratorId && { collaboratorId: params.collaboratorId }),
      ...(params.documentTypeId && { documentTypeId: params.documentTypeId }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.document.findMany({
        where,
        include: { versions: true },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.document.count({ where }),
    ]);

    return {
      data: items.map((data) =>
        Document.restore({
          id: data.id,
          collaboratorId: data.collaboratorId,
          documentTypeId: data.documentTypeId,
          status: DocumentStatus.PENDING,
          versions: data.versions.map(
            (v) =>
              new DocumentVersion({
                id: v.id,
                version: v.version,
                fileName: v.fileName,
                filePath: v.filePath,
                mimeType: v.mimeType,
                isActive: v.isActive,
                createdAt: v.createdAt,
              }),
          ),
          createdAt: data.createdAt,
          deletedAt: data.deletedAt,
        }),
      ),
      total,
    };
  }
}
