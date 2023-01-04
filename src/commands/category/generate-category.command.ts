import {Command, CommandRunner} from "nest-commander";
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "../../database/entities";
import {Repository} from "typeorm";
import {CoreLoggerService} from "../../modules/common/services/logger/base-logger.service";
import {categories} from "../../modules/game/constants/game.constant";

@Command({ name: 'generate-category', description: 'category' })
export class GenerateCategoryCommand extends CommandRunner {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {
        super();
    }
    private readonly logger = new CoreLoggerService(GenerateCategoryCommand.name, true,);
    async run(): Promise<void> {
        await this.createCategory();
    }
    async createCategory(): Promise<void> {
        const arrCategory = [];

        for (const category of categories) {
            const entity = new Category();
            entity.name = category.name;
            entity.description = '';
            entity.createdAt = new Date();
            entity.updatedAt = new Date();
            arrCategory.push(entity)
        }
        await this.categoryRepository.insert(arrCategory);
    }
}
