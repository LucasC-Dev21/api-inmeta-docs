import { Body, Controller, Post } from '@nestjs/common';
import { CreateCollaboratorUseCase } from 'src/application/use-cases/create-collaborator.use-case';
import { CreateCollaboratorDto } from '../dtos/create-collaborator.dto';

@Controller('collaborators')
export class CollaboratorController {
  constructor(
    private readonly createCollaboratorUseCase: CreateCollaboratorUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateCollaboratorDto) {
    return this.createCollaboratorUseCase.execute(dto);
  }
}
