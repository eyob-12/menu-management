import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  async getAllMenus() {
    return this.prisma.menu.findMany({ include: { children: true } });
  }

  async getMenuById(id: string) {
    return this.prisma.menu.findUnique({ where: { id }, include: { children: true } });
  }

  async addMenu(name: string, parentId?: string) {
    return this.prisma.menu.create({
      data: { name, parentId },
    });
  }

  async updateMenu(id: string, name: string) {
    return this.prisma.menu.update({ where: { id }, data: { name } });
  }

  async deleteMenu(id: string) {
    return this.prisma.menu.delete({ where: { id } });
  }
}
