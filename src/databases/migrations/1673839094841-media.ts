import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";
import {DatabaseUtils} from "../../common/utils/database.utils";

export class media1673839094841 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "media",
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
                        isNullable: true
                    }),
                    new TableColumn({
                        name: "user_id",
                        type: "int",
                        isNullable: true
                    }),
                    new TableColumn({
                        name: "description",
                        type: "varchar",
                        isNullable: true
                    }),
                    new TableColumn({
                        name: "type",
                        type: "int",
                        isNullable: false
                    }),
                    new TableColumn({
                        name: "uri",
                        type: "varchar",
                        isNullable: false
                    }),
                    new TableColumn({
                        name: "size",
                        type: "varchar",
                        isNullable: true
                    }),
                    ...DatabaseUtils.getDefaultColumns(),
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('media');
    }

}
