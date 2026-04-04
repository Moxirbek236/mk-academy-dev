import { Module } from '@nestjs/common';
import { VocabularysService } from './vocabularies.service';
import { VocabularysController } from './vocabularies.controller';

@Module({
  controllers: [VocabularysController],
  providers: [VocabularysService],
  exports: [VocabularysService],
})
export class VocabularysModule {}
