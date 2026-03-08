import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { CollaboratorController } from './collaborator.controller';
import { DocumentTypeController } from './document-type.controller';
import { CreateCollaboratorUseCase } from 'src/application/use-cases/create-collaborator.use-case';
import { CreateDocumentTypeUseCase } from 'src/application/use-cases/document-types/create-document-type.use-case';
import { GetDocumentTypeUseCase } from 'src/application/use-cases/document-types/get-document-type.use-case';
import { ListDocumentTypesUseCase } from 'src/application/use-cases/document-types/list-document-types.use-case';
import { UpdateDocumentTypeUseCase } from 'src/application/use-cases/document-types/update-document-type.use-case';
import { DeleteDocumentTypeUseCase } from 'src/application/use-cases/document-types/delete-document-type.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [CollaboratorController, DocumentTypeController],
  providers: [
    CreateCollaboratorUseCase,
    CreateDocumentTypeUseCase,
    GetDocumentTypeUseCase,
    ListDocumentTypesUseCase,
    UpdateDocumentTypeUseCase,
    DeleteDocumentTypeUseCase,
  ],
})
export class ControllerModule {}
