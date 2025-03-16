import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { testConfig } from '../config/test.config';

export class TestSetup {
  // #proporties
  // nestjs application instance
  app: INestApplication;

  // database connection
  dataSource: DataSource;

  // #setup
  //  (creating and initializing test environment)
  static async create(module: any) {
    const instance = new TestSetup();
    await instance.init(module);
    return instance;
  }

  // sets up testing module with custom configuration
  private async init(module: any) {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [module],
    })
      // replace normal config with test config
      // this lets us use different database, port etc. for testing
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string) => {
          if (key.includes('database')) return testConfig.database;
          if (key.includes('app')) return testConfig.app;
          if (key.includes('auth')) return testConfig.auth;
        },
      })
      .compile();

    // create nestjs app
    this.app = moduleFixture.createNestApplication();
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        exceptionFactory: (errors) => {
          throw new BadRequestException({
            statusCode: 400,
            message: 'Validation failed',
            errors: errors.map((error) => ({
              field: error.property,
              errors: Object.values(error.constraints || {}),
            })),
          });
        },
      }),
    );
    // get db connection
    this.dataSource = moduleFixture.get(DataSource);
    // initialize app (starts server, connects to db etc.)
    await this.app.init();
  }

  // #manage database operations
  // cleans all tables between tests
  async cleanup() {
    const entities = this.dataSource.entityMetadatas;
    // create list of table names for SQL query
    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .join(', ');
    // truncate removes all data
    // restart identity resets auto-increment counters
    // cascade handles foreign key relationships
    await this.dataSource.query(
      `TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`,
    );
  }

  // #cleanup
  // close database and app after tests
  async teardown() {
    await this.dataSource.destroy();
    await this.app.close();
  }
}
