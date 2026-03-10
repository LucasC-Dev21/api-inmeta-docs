import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError } from '../errors/app.error';
import { Prisma } from '@prisma/client';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, message } = this.resolveException(exception);

    this.logger.error(
      `${request.method} ${request.url} → ${status}: ${message}`,
    );

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveException(exception: unknown): {
    status: number;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : ((response as any).message ?? exception.message);

      return {
        status: exception.getStatus(),
        message: Array.isArray(message) ? message.join(', ') : message,
      };
    }

    if (exception instanceof AppError) {
      return { status: exception.statusCode, message: exception.message };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.resolvePrismaError(exception);
    }

    if (exception instanceof Error) {
      return this.resolveDomainError(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    };
  }

  private resolvePrismaError(exception: Prisma.PrismaClientKnownRequestError): {
    status: number;
    message: string;
  } {
    switch (exception.code) {
      case 'P2002':
        return {
          status: HttpStatus.CONFLICT,
          message: 'Registro duplicado',
        };
      case 'P2025':
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Registro não encontrado',
        };
      case 'P2003':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Violação de chave estrangeira',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Erro de banco de dados',
        };
    }
  }

  private resolveDomainError(exception: Error): {
    status: number;
    message: string;
  } {
    const domainErrors: Record<string, number> = {
      'Nome inválido': HttpStatus.BAD_REQUEST,
      'Email inválido': HttpStatus.BAD_REQUEST,
      'Já existe um colaborador cadastrado com esse email': HttpStatus.CONFLICT,
      'Colaborador já está removido': HttpStatus.CONFLICT,
      'Tipo de documento já removido': HttpStatus.CONFLICT,
      'Documento já removido': HttpStatus.CONFLICT,
      'Versão inválida': HttpStatus.BAD_REQUEST,
      'Arquivo inválido': HttpStatus.BAD_REQUEST,
      'Documento inválido': HttpStatus.BAD_REQUEST,
      'Documento inconsistente': HttpStatus.INTERNAL_SERVER_ERROR,
      'Documento removido': HttpStatus.GONE,
    };

    const status = domainErrors[exception.message];

    if (status) {
      return { status, message: exception.message };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Erro interno do servidor',
    };
  }
}
