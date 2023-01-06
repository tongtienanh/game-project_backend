import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import {UsersImplService} from '../services/users-impl.service';
import {CreateUserDto} from '../dto/create-user.dto';
import {UpdateUserDto} from '../dto/update-user.dto';
import { Permission } from '../../auth/decorators/permisson.decorator';
import { ResponseEntity } from 'src/common/resources/base/response.entity';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

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
    findAll() {
        return this.usersService.findAll();
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
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
