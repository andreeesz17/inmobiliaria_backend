import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { SuccessResponseDto } from '../common/dto/response.dto';
import { QueryDto } from '../common/dto/query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll(@Query() query: QueryDto) {
    const users = await this.usersService.paginate(
      query.page,
      query.limit,
    );

    return new SuccessResponseDto(
      'Lista de usuarios',
      users,
    );
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);
    return new SuccessResponseDto(
      'Usuario encontrado',
      user,
    );
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, dto);
    return new SuccessResponseDto(
      'Usuario actualizado',
      user,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: number) {
    const deleted = await this.usersService.remove(id);
    return new SuccessResponseDto(
      'Usuario eliminado',
      deleted,
    );
  }
}
