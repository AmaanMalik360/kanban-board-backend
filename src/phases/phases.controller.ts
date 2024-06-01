import { Controller, Get, Post, Body } from '@nestjs/common';
import { PhasesService } from './phases.service';
import { CreatePhaseDto } from './dto/create-phase.dto';

@Controller('')
export class PhasesController {
  constructor(private readonly phasesService: PhasesService) {}

  @Post('admin/phases')
  create(@Body() createPhaseDto: CreatePhaseDto) {
    return this.phasesService.create(createPhaseDto);
  }

  @Get('phases')
  findAll() {
    return this.phasesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.phasesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePhaseDto: UpdatePhaseDto) {
  //   return this.phasesService.update(+id, updatePhaseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.phasesService.remove(+id);
  // }
}
