import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Initial migration to create the "users" table in the database.
 * 
 * This migration adds a table for storing user information, including their
 * email, password, and role. It's intended to be the initial schema setup for
 * managing user data within the application.
 */
export class InitialMigration1711085051379 implements MigrationInterface {
    /**
     * Run the migrations.
     * 
     * Creates the "users" table with columns for user ID, email, password, and role.
     * 
     * @param queryRunner The QueryRunner instance that allows manipulation of the database.
     */
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

    /**
     * Reverse the migrations.
     * 
     * Drops the "users" table, effectively rolling back the migration.
     * 
     * @param queryRunner The QueryRunner instance that allows manipulation of the database.
     */
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }
}

