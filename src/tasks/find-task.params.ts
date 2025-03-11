import { IsEnum, IsOptional } from 'class-validator';
import { TaskRelations, TaskStatus } from './task.model';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskRelations)
  relations?: TaskRelations;
}
