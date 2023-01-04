import {IsNotEmpty} from "class-validator";
import {Transform} from "class-transformer";
import {TransformUtils} from "../../core/utils/transform.utils";
import {ApiProperty} from "@nestjs/swagger";
import {Game} from "../../../database/entities";
import {HelperUtils} from "../../core/utils/helper.utils";

export class CreateGameDto {
    @Transform(TransformUtils.parseNumber)
    gameId?: number;

    @IsNotEmpty()
    @Transform(TransformUtils.parseString)
    @ApiProperty({example: "call of dusty"})
    name: string;

    @Transform(TransformUtils.parseString)
    @ApiProperty({example: "tonganh.jpg"})
    image: string;

    @Transform(TransformUtils.parseString)
    @ApiProperty({example: "The game of the year"})
    description: string;

    @Transform(TransformUtils.parseString)
    @ApiProperty({example: "The game of the year"})
    content: string;

    links?: Link[];

    @Transform(TransformUtils.parseNumberArray)
    tags: number[];

    @Transform(TransformUtils.parseNumberArray)
    categories?: number[];

    toEntity(): Game {
        const entity = new Game();
        entity.name = this.name;
        entity.image = this.image;
        entity.description = this.description;
        entity.slug = HelperUtils.toSlug(this.name);
        entity.content = this.content;
        entity.createdAt = new Date();
        entity.updatedAt = new Date();

        return entity;
    }

}
class Link {
    @Transform(TransformUtils.parseNumber)
    type: number;

    @Transform(TransformUtils.parseString)
    url: string;
}
