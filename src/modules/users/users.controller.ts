import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from '@common/guards/access-token.guard';
import { Role } from '@common/decorators/role.decorator';
import { RoleGuard } from '@common/guards/role.guard';
import { CreatorGuard } from '@common/guards/creator.guard';
import { UserRole } from './enums/user-role.enum';


@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // HACK: Maybe create a service and controller admin for Dashboard modules ?
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('getAll')
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(CreatorGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(CreatorGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(CreatorGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
