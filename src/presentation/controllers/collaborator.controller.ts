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
import { CreateCollaboratorUseCase } from 'src/application/use-cases/collaborators/create-collaborator.use-case';
import { GetCollaboratorUseCase } from 'src/application/use-cases/collaborators/get-collaborator.use-case';
import { ListCollaboratorsUseCase } from 'src/application/use-cases/collaborators/list-collaborators.use-case';
import { UpdateCollaboratorUseCase } from 'src/application/use-cases/collaborators/update-collaborator.use-case';
import { DeleteCollaboratorUseCase } from 'src/application/use-cases/collaborators/delete-collaborator.use-case';
import { CreateCollaboratorDto } from '../dtos/create-collaborator.dto';
import { UpdateCollaboratorDto } from '../dtos/update-collaborator.dto';

@Controller('collaborators')
export class CollaboratorController {
  constructor(
    private readonly createCollaboratorUseCase: CreateCollaboratorUseCase,
    private readonly getCollaboratorUseCase: GetCollaboratorUseCase,
    private readonly listCollaboratorsUseCase: ListCollaboratorsUseCase,
    private readonly updateCollaboratorUseCase: UpdateCollaboratorUseCase,
    private readonly deleteCollaboratorUseCase: DeleteCollaboratorUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCollaboratorDto) {
    return this.createCollaboratorUseCase.execute(dto);
  }

  @Get()
  findAll() {
    return this.listCollaboratorsUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.getCollaboratorUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCollaboratorDto,
  ) {
    return this.updateCollaboratorUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.deleteCollaboratorUseCase.execute(id);
  }
}
