import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";
import {DatabaseUtils} from "../../common/utils/database.utils";

export class categorites1672817222817 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "category",
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
                        type: "varchar",
                        isNullable: false
                    }),
                    new TableColumn({
                        name: "description",
                        type: "varchar",
                        isNullable: true
                    }),
                    ...DatabaseUtils.getDefaultColumns(),
                ]
            }),
        ),
            await queryRunner.createTable(
                new Table({
                    name: "game_category",
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
                            isNullable: false
                        }),
                        new TableColumn({
                            name: "category_id",
                            type: "int",
                            isNullable: true
                        }),
                        ...DatabaseUtils.getDefaultColumns(),
                    ]
                }),
            )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('category');
        await queryRunner.dropTable('game_category');
    }

}
