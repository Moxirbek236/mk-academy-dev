import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post('questions')
  async seedQuestions() {
    const result = await this.seedService.seedQuestionsIfMissing();

    return {
      status: 200,
      success: true,
      message:
        "Seeder tekshirildi: superadmin va questions idempotent ravishda yaratildi/yangilandi.",
      data: result,
    };
  }
}
