import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateDocumentTypeUseCase } from '../../application/use-cases/document-types/create-document-type.use-case';
import { GetDocumentTypeUseCase } from '../../application/use-cases/document-types/get-document-type.use-case';
import { ListDocumentTypesUseCase } from '../../application/use-cases/document-types/list-document-types.use-case';
import { UpdateDocumentTypeUseCase } from '../../application/use-cases/document-types/update-document-type.use-case';
import { DeleteDocumentTypeUseCase } from '../../application/use-cases/document-types/delete-document-type.use-case';
import {
  CreateDocumentTypeDto,
  UpdateDocumentTypeDto,
} from '../dtos/document-type.dto';

@Controller('document-types')
export class DocumentTypeController {
  constructor(
    private readonly createDocumentTypeUseCase: CreateDocumentTypeUseCase,
    private readonly getDocumentTypeUseCase: GetDocumentTypeUseCase,
    private readonly listDocumentTypesUseCase: ListDocumentTypesUseCase,
    private readonly updateDocumentTypeUseCase: UpdateDocumentTypeUseCase,
    private readonly deleteDocumentTypeUseCase: DeleteDocumentTypeUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDocumentTypeDto) {
    return this.createDocumentTypeUseCase.execute(dto);
  }

  @Get()
  findAll() {
    return this.listDocumentTypesUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getDocumentTypeUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDocumentTypeDto,
  ) {
    return this.updateDocumentTypeUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteDocumentTypeUseCase.execute(id);
  }
}
