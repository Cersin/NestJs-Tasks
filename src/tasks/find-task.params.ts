import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskRelations, TaskStatus } from './task.model';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskRelations)
  relations?: TaskRelations;

  @IsOptional()
  @MinLength(3)
  @IsString()
  search?: string;
}
