import {ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional} from "class-validator";
import {Role} from "../../../database/entities";
import {Transform} from "class-transformer";
import {TransformUtils} from "../../core/utils/transform.utils";

export class StoreRoleRequest {
    @IsOptional()
    @Transform(TransformUtils.parseNumber)
    id: number;

    @IsNotEmpty()
    name: string;

    @IsOptional()
    description?: string;

    @ArrayNotEmpty()
    @IsArray()
    permissionsId: number[];

    toEntity(): Role {
        const entity = new Role();
        entity.name = this.name;
        entity.description = this.description;

        return entity;
    }
}
