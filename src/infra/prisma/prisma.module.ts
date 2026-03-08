import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaCollaboratorRepository } from './repositories/prisma-collaborator.repository';
import { PrismaDocumentTypeRepository } from './repositories/prisma-document-type.repository';
import {
  COLLABORATOR_REPOSITORY,
  DOCUMENT_TYPE_REPOSITORY,
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
  ],
  exports: [COLLABORATOR_REPOSITORY, DOCUMENT_TYPE_REPOSITORY, PrismaService],
})
export class PrismaModule {}
