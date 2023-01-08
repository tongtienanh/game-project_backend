import {Controller, Get, Param} from "@nestjs/common";
import {AclImplService} from "../services/acl-impl.service";
import {ResponseEntity} from "../../../common/resources/base/response.entity";
import {ModulePermission, Permissions} from "../../../database/entities";
import {Permission} from "../../auth/decorators/permisson.decorator";

@Controller('api/module')
export class AclController {
    constructor(
        private readonly aclService: AclImplService
    ) {}
    @Get()
    @Permission()
    async getListModule(): Promise<ResponseEntity<ModulePermission[]>> {
        const response = await this.aclService.getListModule();

        return new ResponseEntity<ModulePermission[]>(response)
    }

    @Get('permission/:id')
    @Permission()
    async getPermisson(@Param("id") permissionId: number): Promise<ResponseEntity<Permissions>> {
        const resposne = await this.aclService.getPermission(permissionId);
        return new ResponseEntity<Permissions>(resposne);
    }
}