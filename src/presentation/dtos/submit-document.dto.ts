import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class SubmitDocumentDto {
  @IsUUID()
  @IsNotEmpty()
  documentTypeId!: string;

  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  filePath!: string;

  @IsOptional()
  @IsString()
  mimeType?: string;
}
