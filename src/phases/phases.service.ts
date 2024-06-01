import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Phases } from './entities/phase.entity';

@Injectable()
export class PhasesService {
  constructor(
    @InjectRepository(Phases) private phaseRepository: Repository<Phases>,
  ) {}

  async create(createPhaseDto: CreatePhaseDto) {
    try {
      const phaseExists = await this.phaseRepository.findOne({
        where: { name: createPhaseDto.name },
      });

      // console.log(phaseExists);
      if (phaseExists) 
        return { status: HttpStatus.CONFLICT, message: 'Phase already exists'  };
      
      let Phase = this.phaseRepository.create(createPhaseDto);
      let newPhase = this.phaseRepository.save(Phase);
      return {
        status: HttpStatus.CREATED,
        message: 'Phase created successfully',
        phase: newPhase // assuming newPhase holds the newly created phase data
      };
    } 
    catch (error) {
      console.error(error);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error'
      };  
    }
    
  }

  async findAll() {
    try {
      // Fetch all movies from the database
      const phases = await this.phaseRepository.find();
      return { phases };
    } 
    catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} phase`;
  }

  update(id: number, updatePhaseDto: UpdatePhaseDto) {
    return `This action updates a #${id} phase`;
  }

  remove(id: number) {
    return `This action removes a #${id} phase`;
  }
}
