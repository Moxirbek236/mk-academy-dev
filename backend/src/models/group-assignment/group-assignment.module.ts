import { Module } from '@nestjs/common';
import { GroupAssignmentService } from './group-assignment.service';
import { GroupAssignmentController } from './group-assignment.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule],
  controllers: [GroupAssignmentController],
  providers: [GroupAssignmentService],
  exports: [GroupAssignmentService],
})
export class GroupAssignmentModule {}
