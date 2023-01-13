import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";
import {DatabaseUtils} from "../../common/utils/database.utils";

export class game1672711784798 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "game",
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
                        isNullable: false,
                        isUnique: true
                    }),
                    new TableColumn({
                        name: "image",
                        type: "varchar",
                        isNullable: true
                    }),
                    new TableColumn({
                        name: "description",
                        type: "longtext",
                        isNullable: true
                    }),
                    new TableColumn({
                        name: "content",
                        type: "longtext",
                        isNullable: true
                    }),
                    new TableColumn({
                        name: "slug",
                        type: "varchar",
                        isUnique: true,
                        isNullable: false
                    }),
                    ...DatabaseUtils.getDefaultColumns(),
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('game');
    }

}
