import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`avatarUrl\` varchar(500) NULL,
        \`role\` enum('admin', 'manager', 'member') NOT NULL DEFAULT 'member',
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE \`projects\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`description\` text NULL,
        \`status\` enum('active', 'completed', 'on_hold', 'cancelled') NOT NULL DEFAULT 'active',
        \`startDate\` date NULL,
        \`endDate\` date NULL,
        \`created_by\` int NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`FK_4b0b0b0b0b0b0b0b0b0b0b0b0b0b\` (\`created_by\`),
        CONSTRAINT \`FK_4b0b0b0b0b0b0b0b0b0b0b0b0b0b\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create project_members table
    await queryRunner.query(`
      CREATE TABLE \`project_members\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`project_id\` int NOT NULL,
        \`user_id\` int NOT NULL,
        \`role\` enum('owner', 'admin', 'member') NOT NULL DEFAULT 'member',
        \`joined_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_project_user\` (\`project_id\`, \`user_id\`),
        INDEX \`FK_project_member_project\` (\`project_id\`),
        INDEX \`FK_project_member_user\` (\`user_id\`),
        CONSTRAINT \`FK_project_member_project\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_project_member_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create tasks table
    await queryRunner.query(`
      CREATE TABLE \`tasks\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`description\` text NULL,
        \`status\` enum('todo', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'todo',
        \`priority\` enum('low', 'normal', 'high', 'urgent') NOT NULL DEFAULT 'normal',
        \`dueDate\` date NULL,
        \`project_id\` int NULL,
        \`created_by\` int NOT NULL,
        \`assigned_to\` int NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`FK_task_project\` (\`project_id\`),
        INDEX \`FK_task_created_by\` (\`created_by\`),
        INDEX \`FK_task_assigned_to\` (\`assigned_to\`),
        CONSTRAINT \`FK_task_project\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_task_created_by\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_task_assigned_to\` FOREIGN KEY (\`assigned_to\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    // Create task_assignees table
    await queryRunner.query(`
      CREATE TABLE \`task_assignees\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`task_id\` int NOT NULL,
        \`user_id\` int NOT NULL,
        \`assigned_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_task_user\` (\`task_id\`, \`user_id\`),
        INDEX \`FK_task_assignee_task\` (\`task_id\`),
        INDEX \`FK_task_assignee_user\` (\`user_id\`),
        CONSTRAINT \`FK_task_assignee_task\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_task_assignee_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create comments table
    await queryRunner.query(`
      CREATE TABLE \`comments\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`content\` text NOT NULL,
        \`task_id\` int NOT NULL,
        \`author_id\` int NOT NULL,
        \`parent_comment_id\` int NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`FK_comment_task\` (\`task_id\`),
        INDEX \`FK_comment_author\` (\`author_id\`),
        INDEX \`FK_comment_parent\` (\`parent_comment_id\`),
        CONSTRAINT \`FK_comment_task\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_comment_author\` FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_comment_parent\` FOREIGN KEY (\`parent_comment_id\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create task_attachments table
    await queryRunner.query(`
      CREATE TABLE \`task_attachments\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`task_id\` int NOT NULL,
        \`filename\` varchar(255) NOT NULL,
        \`original_name\` varchar(255) NOT NULL,
        \`file_path\` varchar(500) NOT NULL,
        \`file_size\` int NOT NULL,
        \`mime_type\` varchar(100) NOT NULL,
        \`uploaded_by\` int NOT NULL,
        \`uploaded_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`FK_attachment_task\` (\`task_id\`),
        INDEX \`FK_attachment_uploader\` (\`uploaded_by\`),
        CONSTRAINT \`FK_attachment_task\` FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_attachment_uploader\` FOREIGN KEY (\`uploaded_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create activity_logs table
    await queryRunner.query(`
      CREATE TABLE \`activity_logs\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`entity_type\` enum('task', 'project', 'comment') NOT NULL,
        \`entity_id\` int NOT NULL,
        \`action\` enum('created', 'updated', 'deleted', 'assigned', 'commented', 'status_changed', 'priority_changed') NOT NULL,
        \`description\` text NULL,
        \`performed_by\` int NOT NULL,
        \`performed_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`metadata\` json NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`FK_activity_performer\` (\`performed_by\`),
        INDEX \`IDX_activity_entity\` (\`entity_type\`, \`entity_id\`),
        CONSTRAINT \`FK_activity_performer\` FOREIGN KEY (\`performed_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE \`activity_logs\``);
    await queryRunner.query(`DROP TABLE \`task_attachments\``);
    await queryRunner.query(`DROP TABLE \`comments\``);
    await queryRunner.query(`DROP TABLE \`task_assignees\``);
    await queryRunner.query(`DROP TABLE \`tasks\``);
    await queryRunner.query(`DROP TABLE \`project_members\``);
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
