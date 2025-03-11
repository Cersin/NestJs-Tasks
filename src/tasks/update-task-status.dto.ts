import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// export class UpdateTaskStatusDto {
//   @IsNotEmpty()
//   @IsEnum(TaskStatus)
//   status: TaskStatus;
// }

export class UpdateTaskStatusDto extends PartialType(
  PickType(CreateTaskDto, ['status'] as const),
) {}
