import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaCollaboratorRepository } from './repositories/prisma-collaborator.repository';
import { PrismaDocumentTypeRepository } from './repositories/prisma-document-type.repository';
import { PrismaCollaboratorDocumentTypeRepository } from './repositories/prisma-collaborator-document-type.repository';
import { PrismaDocumentRepository } from './repositories/prisma-document.repository';
import { PrismaStatisticsRepository } from './repositories/prisma-statistics.repository';
import {
  COLLABORATOR_REPOSITORY,
  COLLABORATOR_DOCUMENT_TYPE_REPOSITORY,
  DOCUMENT_TYPE_REPOSITORY,
  DOCUMENT_REPOSITORY,
  STATISTICS_REPOSITORY,
} from '../../shared/constants/repository.tokens';

@Module({
  providers: [
    PrismaService,
    {
      provide: COLLABORATOR_REPOSITORY,
      useClass: PrismaCollaboratorRepository,
    },
    {
      provide: DOCUMENT_TYPE_REPOSITORY,
      useClass: PrismaDocumentTypeRepository,
    },
    {
      provide: COLLABORATOR_DOCUMENT_TYPE_REPOSITORY,
      useClass: PrismaCollaboratorDocumentTypeRepository,
    },
    { provide: DOCUMENT_REPOSITORY, useClass: PrismaDocumentRepository },
    { provide: STATISTICS_REPOSITORY, useClass: PrismaStatisticsRepository },
  ],
  exports: [
    COLLABORATOR_REPOSITORY,
    DOCUMENT_TYPE_REPOSITORY,
    COLLABORATOR_DOCUMENT_TYPE_REPOSITORY,
    DOCUMENT_REPOSITORY,
    STATISTICS_REPOSITORY,
    PrismaService,
  ],
})
export class PrismaModule {}
