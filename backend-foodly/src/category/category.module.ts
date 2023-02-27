import { Module } from '@nestjs/common';
import { EmployeeModule } from 'src/employee/employee.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [EmployeeModule],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
