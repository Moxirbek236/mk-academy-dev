import { Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get notification feed for the current user' })
  findMyNotifications(@Req() req: any) {
    return this.notificationService.findFeedForCurrentUser(req['user']);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all notifications for a user' })
  findAllByUser(@Param('userId') userId: string, @Req() req: any) {
    return this.notificationService.findAllByUser(+userId, req['user']);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationService.markAsRead(+id, req['user']);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all current user notifications as read' })
  markAllAsRead(@Req() req: any) {
    return this.notificationService.markAllAsRead(req['user']);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.notificationService.remove(+id, req['user']);
  }
}
