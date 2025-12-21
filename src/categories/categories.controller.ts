import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { QueryDto } from '../common/dto/query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    return new SuccessResponseDto(
      'Categoría creada',
      category,
    );
  }

  @Get()
  async findAll(@Query() query: QueryDto) {
    const result = await this.categoriesService.paginate(
      query.page,
      query.limit,
    );

    return new SuccessResponseDto(
      'Lista de categorías',
      result,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const category = await this.categoriesService.findOne(id);
    return new SuccessResponseDto(
      'Categoría encontrada',
      category,
    );
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.update(id, dto);
    return new SuccessResponseDto(
      'Categoría actualizada',
      category,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    const deleted = await this.categoriesService.remove(id);
    return new SuccessResponseDto(
      'Categoría eliminada',
      deleted,
    );
  }
}
