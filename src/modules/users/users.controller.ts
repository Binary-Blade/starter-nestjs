import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@common/decorators/role.decorator';
import { UserRole } from './enums/user-role.enum';
import { UpdateUserDto } from './dto';
import { AccessTokenGuard, IsCreatorGuard, RoleGuard } from '@security/guards';

/**
 * Controller that manages user operations. It includes endpoints for fetching,
 * updating, and deleting user data. Access is secured with guards based on
 * authentication and authorization roles.
 */
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Fetches all users. This operation is restricted to admins.
   * @returns A list of user entities.
   */
  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('getAll')
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * Fetches a single user by ID. Access is restricted to the user themself or an admin.
   * @param id The ID of the user to fetch.
   * @returns The requested user entity.
   */
  @UseGuards(IsCreatorGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  /**
   * Updates a user's data. Access is restricted to the user themself or an admin.
   * @param id The ID of the user to update.
   * @param updateUserDto The updated user data.
   * @returns The updated user entity.
   */
  @UseGuards(IsCreatorGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  /**
   * Deletes a user. Access is restricted to the user themself or an admin.
   * @param id The ID of the user to delete.
   */
  @UseGuards(IsCreatorGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
