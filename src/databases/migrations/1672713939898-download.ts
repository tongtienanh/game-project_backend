import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";
import {DatabaseUtils} from "../../common/utils/database.utils";

export class download1672713939898 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "download",
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
                        name: "link",
                        type: "varchar",
                        isNullable: true
                    }),
                    new TableColumn({
                        name: "type",
                        type: "int",
                        isNullable: true
                    }),
                    ...DatabaseUtils.getDefaultColumns(),
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('download');
    }

}
