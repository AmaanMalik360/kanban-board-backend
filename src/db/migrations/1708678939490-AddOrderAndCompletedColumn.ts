import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderAndCompletedColumn1708678939490 implements MigrationInterface {
    name = 'AddOrderAndCompletedColumn1708678939490'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`completed\` tinyint NOT NULL `);
        await queryRunner.query(`ALTER TABLE \`tickets\` ADD \`order\` int NOT NULL`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`order\``);
        await queryRunner.query(`ALTER TABLE \`tickets\` DROP COLUMN \`completed\``);

    }

}
