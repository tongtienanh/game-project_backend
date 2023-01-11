import {Body, Controller, Get, Param, Post, Query} from "@nestjs/common";
import {AclImplService} from "../services/acl-impl.service";
import {ResponseEntity} from "../../../common/resources/base/response.entity";
import {ModulePermission, Permissions} from "../../../database/entities";
import {Permission} from "../../auth/decorators/permisson.decorator";
import {StoreRoleRequest} from "../requests/store-role.request";

@Controller('api/role')
export class AclController {
    constructor(
        private readonly aclService: AclImplService
    ) {}
    @Get('/module')
    @Permission()
    async getListModule(): Promise<ResponseEntity<ModulePermission[]>> {
        const response = await this.aclService.getListModule();

        return new ResponseEntity<ModulePermission[]>(response)
    }
    @Post()
    @Permission()
    async storeRole(@Body() request: StoreRoleRequest): Promise<any> {
        const response = await this.aclService.store(request);

        return;
    }
}
