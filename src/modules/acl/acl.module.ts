import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AclController} from "./controllers/acl.controller";
import {AclImplService} from "./services/acl-impl.service";
import {ModulePermission, Permissions, Role, RolePermission} from "../../database/entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ModulePermission,
            Permissions,
            RolePermission,
            Role,
        ])
    ],
    controllers: [AclController],
    providers: [AclImplService]
})
export class AclModule {
}
