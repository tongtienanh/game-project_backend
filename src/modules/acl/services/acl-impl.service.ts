import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ModulePermission} from "../../../database/entities/role/module.entity";
import {Permissions} from "../../../database/entities/role/permission.entity"
import {Repository} from "typeorm";
import {CoreLoggerService} from "../../common/services/logger/base-logger.service";

@Injectable()
export class AclImplService {
    constructor(
        @InjectRepository(ModulePermission)
        private moduleRepository: Repository<ModulePermission>,
        @InjectRepository(Permissions)
        private permissionsRepository: Repository<Permissions>
    ) {}
    private readonly logger = new CoreLoggerService(AclImplService.name);

    async getListModule(): Promise<ModulePermission[]> {
        return await this.moduleRepository.find({
            relations: ["permissions"]
        });
    }
    async getPermission(permissionId: number): Promise<Permissions> {
        if (!permissionId) throw new Error("Not found id");
        return await this.permissionsRepository.findOne(permissionId)
    }
}