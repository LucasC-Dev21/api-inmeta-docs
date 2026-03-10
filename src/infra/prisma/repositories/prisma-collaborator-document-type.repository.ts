import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CollaboratorDocumentTypeRepository } from '../../../domain/repositories/collaborator-document-type.repository';

@Injectable()
export class PrismaCollaboratorDocumentTypeRepository implements CollaboratorDocumentTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async link(collaboratorId: string, documentTypeId: string): Promise<void> {
    await this.prisma.collaboratorDocumentType.create({
      data: { collaboratorId, documentTypeId },
    });
  }

  async unlink(collaboratorId: string, documentTypeId: string): Promise<void> {
    await this.prisma.collaboratorDocumentType.updateMany({
      where: {
        collaboratorId,
        documentTypeId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  async findLink(
    collaboratorId: string,
    documentTypeId: string,
  ): Promise<boolean> {
    const link = await this.prisma.collaboratorDocumentType.findFirst({
      where: { collaboratorId, documentTypeId, deletedAt: null },
    });
    return !!link;
  }

  async findByCollaborator(collaboratorId: string): Promise<string[]> {
    const links = await this.prisma.collaboratorDocumentType.findMany({
      where: { collaboratorId, deletedAt: null },
      select: { documentTypeId: true },
    });
    return links.map((l) => l.documentTypeId);
  }
}
