import {Injectable, UnprocessableEntityException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ModulePermission} from "../../../database/entities/role/module.entity";
import {Permissions} from "../../../database/entities/role/permission.entity"
import {In, Repository} from "typeorm";
import {CoreLoggerService} from "../../common/services/logger/base-logger.service";
import {StoreRoleRequest} from "../requests/store-role.request";
import {Role, RolePermission} from "../../../database/entities";

@Injectable()
export class AclImplService {
    constructor(
        @InjectRepository(ModulePermission)
        private moduleRepository: Repository<ModulePermission>,
        @InjectRepository(Permissions)
        private permissionsRepository: Repository<Permissions>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) {
    }

    private readonly logger = new CoreLoggerService(AclImplService.name);

    async getListModule(): Promise<ModulePermission[]> {
        return await this.moduleRepository.find({
            relations: ["permissions"]
        });
    }

    async store(request: StoreRoleRequest): Promise<boolean> {
        let entity = request.toEntity();
        if (request.id) {
            entity = await this.roleRepository.findOne({
                relations: ["rolePermission"],
                where: {
                    id: request.id
                }
            })
        }
        const totalPermission = await this.permissionsRepository.count({id: In(request.permissionsId)});
        if (totalPermission != request.permissionsId.length) throw new UnprocessableEntityException("PermissionsId not exist.")
        const rolePermissions = []
        for (const permissionsId of request.permissionsId) {
            const rolePermissionEntity = new RolePermission();
            rolePermissionEntity.permissionId = permissionsId;
            this.logger.debug(rolePermissionEntity)
            rolePermissions.push(rolePermissionEntity);
        }
        entity.rolePermission = rolePermissions;
        await this.roleRepository.save(entity);

        return true;
    }

    async listRole(): Promise<Role[]> {
        const roles = await this.roleRepository.find()
        return roles
    }
}
