import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { SubmitDocumentUseCase } from '../../application/use-cases/documents/submit-document.use-case';
import { GetDocumentUseCase } from '../../application/use-cases/documents/get-document.use-case';
import { SubmitDocumentDto } from '../dtos/submit-document.dto';

@Controller('collaborators/:collaboratorId/documents')
export class DocumentController {
  constructor(
    private readonly submitDocumentUseCase: SubmitDocumentUseCase,
    private readonly getDocumentUseCase: GetDocumentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  submit(
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Body() dto: SubmitDocumentDto,
  ) {
    return this.submitDocumentUseCase.execute({
      collaboratorId,
      ...dto,
    });
  }

  @Get(':documentTypeId')
  get(
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Param('documentTypeId', ParseUUIDPipe) documentTypeId: string,
  ) {
    return this.getDocumentUseCase.execute(collaboratorId, documentTypeId);
  }
}
