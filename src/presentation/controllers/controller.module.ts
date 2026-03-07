import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { CollaboratorController } from './collaborator.controller';
import { CreateCollaboratorUseCase } from 'src/application/use-cases/create-collaborator.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [CollaboratorController],
  providers: [CreateCollaboratorUseCase],
})
export class ControllerModule {}
