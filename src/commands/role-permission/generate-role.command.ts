import { InjectRepository } from '@nestjs/typeorm';
import { Command, CommandRunner } from 'nest-commander';
import { CoreLoggerService } from './../../modules/common/services/logger/base-logger.service';
import { Role } from './../../database/entities/role/role.entity';
import { Repository } from 'typeorm';
import { RolePermission } from './../../database/entities/role/role-permissions.entity';
import { ModuleConstant } from './../../modules/acl/constant/module.constant';
import { ModulePermission } from './../../database/entities/role/module.entity';
import { Permissions } from './../../database/entities/role/permission.entity';

@Command({ name: 'generate-role', description: 'role' })
export class GenerateRolePermissionCommand extends CommandRunner {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(ModulePermission)
    private moduleRepository: Repository<ModulePermission>,
    @InjectRepository(Permissions)
    private permissionRepository: Repository<Permissions>,
  ) {
    super();
  }
  private readonly logger = new CoreLoggerService(
    GenerateRolePermissionCommand.name,
    true,
  );
  async run(): Promise<void> {
    await this.createPermission();
  }
  async createPermission(): Promise<void> {
    this.logger.color(":::::START:::::");
    const modules = ModuleConstant.setUp();

    for (const module of modules) {
      let moduleEntity = await this.moduleRepository.findOne({
        where: {name: module.name}
      });
      if (!moduleEntity) {
        moduleEntity = new ModulePermission();
        moduleEntity.name = module.name;
        moduleEntity.description = module.description;
        moduleEntity.createdAt = new Date();
        moduleEntity.updatedAt = new Date();

        await this.moduleRepository.save(moduleEntity);
      }
      this.logger.color(moduleEntity)
      for (const permission of module.permissions) {
        const isExistPermission = await this.permissionRepository.findOne({
          where: {name: permission.name}
        });
        if (!isExistPermission) {
          const permissionEntity = new Permissions();
          permissionEntity.name = permission.name;
          permissionEntity.description = permission.description;
          permissionEntity.moduleId = moduleEntity.id;
          permissionEntity.createdAt = new Date();
          permissionEntity.updatedAt = new Date();

          await this.permissionRepository.save(permissionEntity);
        }
      }
    }
    this.logger.color(":::::::END:::::::");
  }
}
