import {MigrationInterface, QueryRunner} from "typeorm";

export class migInit1588458041017 implements MigrationInterface {
    name = 'migInit1588458041017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "winner_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "point" geometry(Point,4326), CONSTRAINT "PK_9ec69e4bd3a3d98b6c44cd46c17" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "winner_entity"`, undefined);
    }

}
