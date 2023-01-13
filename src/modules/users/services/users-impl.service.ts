import {Injectable} from '@nestjs/common';
import {CreateUserDto} from '../dto/create-user.dto';
import {UpdateUserDto} from '../dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../../database/entities/user/user.entity";
import {Like, Repository} from "typeorm";
import {UserRole} from '../../../database/entities/role/user-role.entity';
import {CoreLoggerService} from '../../common/services/logger/base-logger.service';
import {UserDto} from "../dto/user.dto";
import {PaginationInterface, ResponseEntity} from "../../../common/resources/base/response.entity";

@Injectable()
export class UsersImplService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private userRoleRepository: Repository<UserRole>,
    ) {
    }

    private readonly logger = new CoreLoggerService("UsersImplService.name", true);

    async create(request: CreateUserDto): Promise<boolean> {
        let user = request.toEntity();
        if (request.id) {
            user = await this.userRepository.findOne({
                relations: ["userRoles"],
                where: {
                    id: request.id
                }
            })
        }
        const userRoles = this.setUserRoles(request.roleIds)
        user.userRoles = userRoles;
        await this.userRepository.save(user);

        return true;
    }

    async findAll(query: UserDto): Promise<ResponseEntity<User[]>> {
        const {page = 1, size = 10} = query;
        const skip = (page - 1) * size;
        const whereParams = [];
        if (query.search) {
            whereParams.push({username: query.search});
            whereParams.push({fullname: Like(query.search + '%')});
            whereParams.push({id: query.search});
        }
        const [users, count] = await this.userRepository.findAndCount({
            select: ["id", "username", "gender", "age", "fullname"],
            where: whereParams,
            skip,
            take: size
        })
        const pagination: PaginationInterface = {
            totalElements: count,
            totalPages: Math.ceil(count / size),
            numberOfElements: users.length,
            page,
            size
        }
        return new ResponseEntity<User[]>(users, null, pagination);
    }

    findOne(id: number) {
        return `This action returns a #${id} user`;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    async remove(id: number): Promise<boolean> {
        if (!id) throw new Error("Not found id");
        await this.userRepository.softDelete(id);

        return true;
    }

    setUserRoles(roleIds) {
        const userRoles = [];
        for (const roleId of roleIds) {
            const userRole = new UserRole();
            userRole.roleId = roleId;
            userRole.createdAt = new Date();
            userRole.updatedAt = new Date();
            userRoles.push(userRole);
        }
        this.logger.debug("roleIds:", userRoles)
        return userRoles
    }
}
