import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAdmin1708095399963 implements MigrationInterface {
    name = 'CreateAdmin1708095399963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO users (name, email, password, is_admin, created_at, updated_at)
            VALUES ('Amaan Malik', 'amaanmalik0360@gmail.com', 'Amaan', true, NOW(), NOW())
        `);   
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM users
            WHERE name = 'Amaan Malik' AND email = 'amaanmalik0360@gmail.com'
        `);
    }

}
