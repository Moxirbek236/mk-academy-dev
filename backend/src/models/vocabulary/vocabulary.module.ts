import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { VocabularyProgressService } from './vocabulary-progress.service';
import { VocabularyProgressController } from './vocabulary-progress.controller';
import { WordListService } from './word-list.service';
import { WordListController } from './word-list.controller';
import { PrismaModule } from 'src/core/config/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    VocabularyController,
    VocabularyProgressController,
    WordListController,
  ],
  providers: [
    VocabularyService,
    VocabularyProgressService,
    WordListService,
  ],
  exports: [VocabularyService, VocabularyProgressService, WordListService],
})
export class VocabularyModule {}
