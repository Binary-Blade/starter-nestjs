import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1711085051379 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                CREATE TABLE "users" (
                    "userId" SERIAL PRIMARY KEY,
                    "email" VARCHAR NOT NULL,
                    "password" VARCHAR NOT NULL,
                    "userRole" VARCHAR NOT NULL
                );
            `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
