import {Command, CommandRunner} from "nest-commander";
import {InjectRepository} from "@nestjs/typeorm";
import {Tag} from "../../database/entities";
import {Repository} from "typeorm";
import {CoreLoggerService} from "../../modules/common/services/logger/base-logger.service";
import {optionGame} from "../../modules/game/constants/game.constant";

@Command({ name: 'generate-tag', description: 'role' })
export class GenerateTagCommand extends CommandRunner {
    constructor(
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>
    ) {
        super();
    }
    private readonly logger = new CoreLoggerService(GenerateTagCommand.name, true,);
    async run(): Promise<void> {
        await this.createTags();
    }
    async createTags(): Promise<void> {
        const tags: Tag[] = [];
        for (const tag of optionGame) {
            const entity = new Tag()
            entity.name = tag.name;
            entity.slug = tag.slug;
            entity.createdAt = new Date();
            entity.updatedAt = new Date();
            entity.description = "them sau";

            tags.push(entity);
        }
        await this.tagRepository.insert(tags);
    }
}
