import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissions1708095099198 implements MigrationInterface {
    name = 'AddPermissions1708095099198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO \`permissions\` (\`name\`) VALUES
          ('Write'),
          ('Edit'),
          ('Delete');
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        DELETE FROM permissions WHERE name IN ('Write', 'Edit', 'Delete');
      `);
    }

}
