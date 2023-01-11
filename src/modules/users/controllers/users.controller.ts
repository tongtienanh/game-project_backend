import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import {UsersImplService} from '../services/users-impl.service';
import {CreateUserDto} from '../dto/create-user.dto';
import {UpdateUserDto} from '../dto/update-user.dto';
import { Permission } from '../../auth/decorators/permisson.decorator';
import { ResponseEntity } from 'src/common/resources/base/response.entity';
import {User} from "../../../database/entities/user/user.entity";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {UserDto} from "../dto/user.dto";

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersImplService) {}

  @Post('register')
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() body: CreateUserDto): Promise<ResponseEntity<boolean>> {
    await this.usersService.create(body);

    return new ResponseEntity<boolean>(true);
  }

    @Get()
    @Permission()
    async findAll(@Query() query: UserDto): Promise<ResponseEntity<User[]>> {
        return await this.usersService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<ResponseEntity<boolean>> {
        await this.usersService.remove(id);

        return new ResponseEntity<boolean>(true);
    }
}
