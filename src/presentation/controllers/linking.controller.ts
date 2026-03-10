import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { LinkCollaboratorDocumentTypeUseCase } from '../../application/use-cases/linking/link-collaborator-document-type.use-case';
import { UnlinkCollaboratorDocumentTypeUseCase } from '../../application/use-cases/linking/unlink-collaborator-document-type.use-case';

@Controller('collaborators/:collaboratorId/document-types')
export class LinkingController {
  constructor(
    private readonly linkUseCase: LinkCollaboratorDocumentTypeUseCase,
    private readonly unlinkUseCase: UnlinkCollaboratorDocumentTypeUseCase,
  ) {}

  @Post(':documentTypeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  link(
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Param('documentTypeId', ParseUUIDPipe) documentTypeId: string,
  ) {
    return this.linkUseCase.execute(collaboratorId, documentTypeId);
  }

  @Delete(':documentTypeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  unlink(
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Param('documentTypeId', ParseUUIDPipe) documentTypeId: string,
  ) {
    return this.unlinkUseCase.execute(collaboratorId, documentTypeId);
  }
}
