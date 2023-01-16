import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    Query,
    ParseFilePipe, FileTypeValidator
} from '@nestjs/common';
import {GameImplService} from '../services/game-impl.service';
import {CreateGameDto, DeleteGames} from '../dto/create-game.dto';
import {UpdateGameDto} from '../dto/update-game.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {ResponseEntity} from "../../../common/resources/base/response.entity";
import {GameRequest} from "../dto/game.request";
import {Permission} from "../../auth/decorators/permisson.decorator";
import {diskStorage} from "multer";
import {ConvertNameImage} from "../../common/utils/convert-name-image";
import {extname} from "path";
import {LocalFileDto} from "../../users/dto/local-file.dto";

@Controller('api/game')
export class GameController {
    constructor(private readonly gameService: GameImplService) {
    }

    @Post()
    async create(@Body() createGameDto: CreateGameDto): Promise<ResponseEntity<boolean>> {
        await this.gameService.createOrUpdate(createGameDto);

        return new ResponseEntity<boolean>(true);
    }

    @Post('upload/image')
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: './uploads/avatar',
            filename(req, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
                console.log({file})
                const fileName = ConvertNameImage.toSlug(file.originalname.split('.')[0]);
                const fileExtName = extname(file.originalname);
                callback(null, `${fileName}${fileExtName}`)
            },
        })
    }))
    async upload(@UploadedFile(new ParseFilePipe()) file) {
        const fileData: LocalFileDto = {
            path: file.path,
            fileName: file.originalname,
            mimetype: file.mimetype
        };
        return await this.gameService.upload(fileData)
    }

    @Get('all')
    @Permission()
    async findAll(@Query() request: GameRequest) {
        return await this.gameService.findAll(request);
    }

    @Delete('delete')
    remove(@Query() request: DeleteGames): Promise<ResponseEntity<boolean>> {
        return this.gameService.remove(request);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
        return this.gameService.update(+id, updateGameDto);
    }
    @Post('sharp')
    @UseInterceptors(FileInterceptor("image", {
        storage: diskStorage({
            destination: './uploads/avatar',
            filename(req, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {
                console.log({file})
                const fileName = ConvertNameImage.toSlug(file.originalname.split('.')[0]);
                const fileExtName = extname(file.originalname);
                callback(null, `${fileName}${fileExtName}`)
            },
        })
    }))
    async useSharp(@UploadedFile(new ParseFilePipe()) file) {
        const fileData: LocalFileDto = {
            path: file.path,
            fileName: file.originalname,
            mimetype: file.mimetype
        };
        await this.gameService.sharpFunction(fileData)
    }


}
