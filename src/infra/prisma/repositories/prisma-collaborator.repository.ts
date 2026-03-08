import { CollaboratorRepository } from '../../../domain/repositories/collaborator.repository';
import { Collaborator } from '../../../domain/entities/collaborator.entity';
import { PrismaService } from '../prisma.service';
import { Email } from 'src/domain/value-objects/email.vo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaCollaboratorRepository implements CollaboratorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(collaborator: Collaborator): Promise<void> {
    await this.prisma.collaborator.create({
      data: {
        id: collaborator.getId(),
        name: collaborator.getName(),
        email: collaborator.getEmail(),
        createdAt: collaborator.getCreatedAt(),
        updatedAt: collaborator.getUpdatedAt(),
        deletedAt: collaborator.getDeletedAt(),
      },
    });
  }

  async update(collaborator: Collaborator): Promise<void> {
    await this.prisma.collaborator.update({
      where: { id: collaborator.getId() },
      data: {
        name: collaborator.getName(),
        email: collaborator.getEmail(),
        updatedAt: collaborator.getUpdatedAt(),
        deletedAt: collaborator.getDeletedAt(),
      },
    });
  }

  async findById(id: string): Promise<Collaborator | null> {
    const data = await this.prisma.collaborator.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!data) return null;

    return Collaborator.restore({
      id: data.id,
      name: data.name,
      email: Email.create(data.email),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  async findByEmail(email: string): Promise<Collaborator | null> {
    const data = await this.prisma.collaborator.findFirst({
      where: {
        email: email.toLowerCase(),
        deletedAt: null,
      },
    });

    if (!data) return null;

    return Collaborator.restore({
      id: data.id,
      name: data.name,
      email: Email.create(data.email),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  async findAll(): Promise<Collaborator[]> {
    const data = await this.prisma.collaborator.findMany({
      where: { deletedAt: null },
    });

    return data.map((item) =>
      Collaborator.restore({
        id: item.id,
        name: item.name,
        email: Email.create(item.email),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        deletedAt: item.deletedAt,
      }),
    );
  }
}
