import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile} from '@nestjs/common';
import { GameImplService } from '../services/game-impl.service';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {ResponseEntity} from "../../../common/resources/base/response.entity";
import {GameRequest} from "../dto/game.request";

@Controller('api/game')
export class GameController {
  constructor(private readonly gameService: GameImplService) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto): Promise<ResponseEntity<boolean>> {
    await this.gameService.createOrUpdate(createGameDto);

    return new ResponseEntity<boolean>(true);
  }

  @Post('upload/image')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    return await this.gameService.upload(file)
  }

  @Get('all')
  async findAll(@Param() params: GameRequest) {
    return await this.gameService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }
}
