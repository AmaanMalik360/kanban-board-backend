import { Module } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { PhasesController } from './phases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phases } from './entities/phase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phases])],
  controllers: [PhasesController],
  providers: [PhasesService],
})
export class PhasesModule {}
