import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";
import {DatabaseUtils} from "../../common/utils/database.utils";

export class tag1672713528651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tag",
                columns: [
                    new TableColumn({
                        name: "id",
                        type: 'int',
                        isPrimary: true,
                        generationStrategy: 'increment',
                        isGenerated: true,
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "name",
                        type: "varchar"
                    }),
                    new TableColumn({
                        name: "description",
                        type: "varchar"
                    }),
                    new TableColumn({
                        name: "slug",
                        type: "varchar"
                    }),
                    ...DatabaseUtils.getDefaultColumns(),
                ]
            })
        ),
        await queryRunner.createTable(
            new Table({
                name: "game_tag",
                columns: [
                    new TableColumn({
                        name: "id",
                        type: 'int',
                        isPrimary: true,
                        generationStrategy: 'increment',
                        isGenerated: true,
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "game_id",
                        type: "int",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "tag_id",
                        type: "int",
                        isNullable: false
                    }),
                    ...DatabaseUtils.getDefaultColumns(),
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('tag');
        await queryRunner.dropTable('game_tag');
    }

}
