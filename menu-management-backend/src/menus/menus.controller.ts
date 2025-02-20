import { Controller, Get, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) { }

    @Get()
    getAllMenus() {
        return this.menusService.getAllMenus();
    }

    @Get(':id')
    getMenuById(@Param('id') id: string) {
        return this.menusService.getMenuById(id);
    }

    @Post()
    addMenu(@Body() body: { name: string; parentId?: string }) {
        return this.menusService.addMenu(body.name, body.parentId);
    }

    @Patch(':id')
    updateMenu(@Param('id') id: string, @Body() body: { name: string }) {
        return this.menusService.updateMenu(id, body.name);
    }

    @Delete(':id')
    deleteMenu(@Param('id') id: string) {
        return this.menusService.deleteMenu(id);
    }
}
