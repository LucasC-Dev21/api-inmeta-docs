import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { CollaboratorController } from './collaborator.controller';
import { DocumentTypeController } from './document-type.controller';
import { LinkingController } from './linking.controller';
import { DocumentController } from './document.controller';
import { CreateCollaboratorUseCase } from 'src/application/use-cases/collaborators/create-collaborator.use-case';
import { GetCollaboratorUseCase } from 'src/application/use-cases/collaborators/get-collaborator.use-case';
import { ListCollaboratorsUseCase } from 'src/application/use-cases/collaborators/list-collaborators.use-case';
import { UpdateCollaboratorUseCase } from 'src/application/use-cases/collaborators/update-collaborator.use-case';
import { DeleteCollaboratorUseCase } from 'src/application/use-cases/collaborators/delete-collaborator.use-case';
import { CreateDocumentTypeUseCase } from 'src/application/use-cases/document-types/create-document-type.use-case';
import { GetDocumentTypeUseCase } from 'src/application/use-cases/document-types/get-document-type.use-case';
import { ListDocumentTypesUseCase } from 'src/application/use-cases/document-types/list-document-types.use-case';
import { UpdateDocumentTypeUseCase } from 'src/application/use-cases/document-types/update-document-type.use-case';
import { DeleteDocumentTypeUseCase } from 'src/application/use-cases/document-types/delete-document-type.use-case';
import { LinkCollaboratorDocumentTypeUseCase } from 'src/application/use-cases/linking/link-collaborator-document-type.use-case';
import { UnlinkCollaboratorDocumentTypeUseCase } from 'src/application/use-cases/linking/unlink-collaborator-document-type.use-case';
import { SubmitDocumentUseCase } from 'src/application/use-cases/documents/submit-document.use-case';
import { GetDocumentUseCase } from 'src/application/use-cases/documents/get-document.use-case';
import { ListPendingDocumentsUseCase } from 'src/application/use-cases/documents/list-pending-documents.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [
    CollaboratorController,
    DocumentTypeController,
    LinkingController,
    DocumentController,
  ],
  providers: [
    CreateCollaboratorUseCase,
    GetCollaboratorUseCase,
    ListCollaboratorsUseCase,
    UpdateCollaboratorUseCase,
    DeleteCollaboratorUseCase,
    CreateDocumentTypeUseCase,
    GetDocumentTypeUseCase,
    ListDocumentTypesUseCase,
    UpdateDocumentTypeUseCase,
    DeleteDocumentTypeUseCase,
    LinkCollaboratorDocumentTypeUseCase,
    UnlinkCollaboratorDocumentTypeUseCase,
    SubmitDocumentUseCase,
    GetDocumentUseCase,
    ListPendingDocumentsUseCase,
  ],
})
export class ControllerModule {}
