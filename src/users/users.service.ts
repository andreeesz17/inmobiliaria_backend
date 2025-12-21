import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    return this.userRepo.save(user);
  }

  paginate(
    page: number,
    limit: number,
  ): Promise<Pagination<User>> {
    return paginate<User>(
      this.userRepo,
      { page, limit },
    );
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<User | null> {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
  const result = await this.userRepo.delete(id);
  return (result.affected ?? 0) > 0;
}

}
