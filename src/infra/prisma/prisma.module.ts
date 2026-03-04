import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaCollaboratorRepository } from './repositories/prisma-collaborator.repository';
import { COLLABORATOR_REPOSITORY } from '../../shared/constants/repository.tokens';

@Module({
  providers: [
    PrismaService,
    {
      provide: COLLABORATOR_REPOSITORY,
      useClass: PrismaCollaboratorRepository,
    },
  ],
  exports: [COLLABORATOR_REPOSITORY, PrismaService],
})
export class PrismaModule {}
