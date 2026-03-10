import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { SubmitDocumentUseCase } from '../../application/use-cases/documents/submit-document.use-case';
import { GetDocumentUseCase } from '../../application/use-cases/documents/get-document.use-case';
import { ListPendingDocumentsUseCase } from '../../application/use-cases/documents/list-pending-documents.use-case';
import { SubmitDocumentDto } from '../dtos/submit-document.dto';

@Controller()
export class DocumentController {
  constructor(
    private readonly submitDocumentUseCase: SubmitDocumentUseCase,
    private readonly getDocumentUseCase: GetDocumentUseCase,
    private readonly listPendingDocumentsUseCase: ListPendingDocumentsUseCase,
  ) {}

  @Post('collaborators/:collaboratorId/documents')
  @HttpCode(HttpStatus.CREATED)
  submit(
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Body() dto: SubmitDocumentDto,
  ) {
    return this.submitDocumentUseCase.execute({ collaboratorId, ...dto });
  }

  @Get('collaborators/:collaboratorId/documents/:documentTypeId')
  get(
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Param('documentTypeId', ParseUUIDPipe) documentTypeId: string,
  ) {
    return this.getDocumentUseCase.execute(collaboratorId, documentTypeId);
  }

  @Get('documents/pending')
  listPending(
    @Query('collaboratorId') collaboratorId?: string,
    @Query('documentTypeId') documentTypeId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listPendingDocumentsUseCase.execute({
      collaboratorId,
      documentTypeId,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }
}
