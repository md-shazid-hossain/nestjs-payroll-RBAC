import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DepartmentSeederService } from './department/department.seeder.service';

async function run() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = app.get(DepartmentSeederService);
  await seeder.seed();

  await app.close();
}

run();
