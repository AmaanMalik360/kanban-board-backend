import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, UsePipes, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { WritePermissionGuard } from 'src/guards/permissions/write-permission/write-permission.guard';
import { EditPermissionGuard } from 'src/guards/permissions/edit-permission/edit-permission.guard';
import { UpdateTicketDataDto } from './dto/update-ticket-data.dto';
import { VerticalDragDto } from './dto/vertical-drag.dto';

@Controller('tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(WritePermissionGuard)
  @UsePipes(new ValidationPipe())
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(file, createTicketDto);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }
  
  // get tickets based on the entered word
  @Get(':word')
  findSearchedTickets(
    @Param('word') word: string 
  ) {
    return this.ticketsService.findSearchedTickets(word);
  }

  // get tickets based on the array of users
  @Post('/by-users')
  @UsePipes(new ValidationPipe())
  findSearchedTicketsByUsers(
    @Body() body
  ) {

    // console.log("These are users:",body)
    return this.ticketsService.findSearchedTicketsByUsers(body);
  }

   // Update a Ticket
   @Patch(':id')
   @UseGuards(EditPermissionGuard)
   updateMovie(
     @UploadedFile() file: Express.Multer.File,
     @Param('id', ParseIntPipe) id: number, 
     @Body() updateTicketDto: UpdateTicketDataDto)
   {
     return this.ticketsService.update(id, updateTicketDto, file);
   }

  // Change Phase of a tickets 
  @Patch('/vertical-drag/:phaseId')
  changeOrder(
    @Body() body,
    @Param('phaseId', ParseIntPipe) id: number, 
  ) {
    return this.ticketsService.changeOrder(body, id);
  }
  
  // Change Phase of a tickets 
  @Patch('/horizontal-drag/:oldPhaseId/:newPhaseId/:ticketId')
  update( 
    @Body() body,
    @Param('oldPhaseId', ParseIntPipe) oldPhaseId: number, 
    @Param('newPhaseId', ParseIntPipe) newPhaseId: number, 
    @Param('ticketId', ParseIntPipe) ticketId: number, 
    
    ) {
    return this.ticketsService.changePhase(body, oldPhaseId, newPhaseId, ticketId);
  }

  // Delete a Ticket
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id:number ) {
    return this.ticketsService.remove(id);
  }
}
