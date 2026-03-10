import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StatisticsRepository } from '../../../domain/repositories/statistics.repository';

@Injectable()
export class PrismaStatisticsRepository implements StatisticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCompletionRate(): Promise<number> {
    const totalLinks = await this.prisma.collaboratorDocumentType.count({
      where: { deletedAt: null },
    });

    if (totalLinks === 0) return 100;

    const documentsWithActiveVersion = await this.prisma.document.count({
      where: {
        deletedAt: null,
        versions: {
          some: { isActive: true },
        },
      },
    });

    return Math.round((documentsWithActiveVersion / totalLinks) * 100);
  }

  async getMostPendingDocumentTypes(): Promise<
    { documentTypeId: string; name: string; count: number }[]
  > {
    const results = await this.prisma.collaboratorDocumentType.groupBy({
      by: ['documentTypeId'],
      where: {
        deletedAt: null,
        collaborator: { deletedAt: null },
      },
      _count: { documentTypeId: true },
      orderBy: { _count: { documentTypeId: 'desc' } },
      take: 5,
    });

    const documentTypeIds = results.map((r) => r.documentTypeId);

    const documentTypes = await this.prisma.documentType.findMany({
      where: { id: { in: documentTypeIds } },
      select: { id: true, name: true },
    });

    const nameMap = new Map(documentTypes.map((dt) => [dt.id, dt.name]));

    const submitted = await this.prisma.document.findMany({
      where: {
        documentTypeId: { in: documentTypeIds },
        deletedAt: null,
        versions: { some: { isActive: true } },
      },
      select: { documentTypeId: true, collaboratorId: true },
    });

    const submittedSet = new Set(
      submitted.map((s) => `${s.collaboratorId}-${s.documentTypeId}`),
    );

    const pending = await this.prisma.collaboratorDocumentType.findMany({
      where: {
        documentTypeId: { in: documentTypeIds },
        deletedAt: null,
      },
      select: { collaboratorId: true, documentTypeId: true },
    });

    const pendingCountMap = new Map<string, number>();

    for (const p of pending) {
      const key = `${p.collaboratorId}-${p.documentTypeId}`;

      if (!submittedSet.has(key)) {
        pendingCountMap.set(
          p.documentTypeId,
          (pendingCountMap.get(p.documentTypeId) ?? 0) + 1,
        );
      }
    }

    return results
      .map((r) => ({
        documentTypeId: r.documentTypeId,
        name: nameMap.get(r.documentTypeId) ?? '',
        count: pendingCountMap.get(r.documentTypeId) ?? 0,
      }))
      .filter((r) => r.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  async getLastSubmissions(): Promise<
    {
      documentId: string;
      collaboratorId: string;
      collaboratorName: string;
      documentTypeName: string;
      fileName: string;
      submittedAt: Date;
    }[]
  > {
    const versions = await this.prisma.documentVersion.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        document: {
          include: {
            collaborator: { select: { id: true, name: true } },
            documentType: { select: { name: true } },
          },
        },
      },
    });

    return versions.map((v) => ({
      documentId: v.document.id,
      collaboratorId: v.document.collaborator.id,
      collaboratorName: v.document.collaborator.name,
      documentTypeName: v.document.documentType.name,
      fileName: v.fileName,
      submittedAt: v.createdAt,
    }));
  }
}
