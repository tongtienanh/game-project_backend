import {Transform} from "class-transformer";

export interface GameRequest {
    search?: string,
    tags?: number[],
    categories?: number[],
    page?: number;

    size?: number;
}
