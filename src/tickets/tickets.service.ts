import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tickets } from './entities/ticket.entity';
import { Phases } from 'src/phases/entities/phase.entity';
import { UpdateTicketDataDto } from './dto/update-ticket-data.dto';
import { TicketsByUsersDto } from './dto/tickets-by-user.dto';
import { VerticalDragDto } from './dto/vertical-drag.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets) private ticketRepository: Repository<Tickets>,
    @InjectRepository(Phases) private phaseRepository: Repository<Phases>,
  ) {}

  // Create a New Ticket
  async create(file: Express.Multer.File, createTicketDto: CreateTicketDto) {
    try {
      const { title, description, user_id, phase_id } = createTicketDto;

      // Check if the ticket already exists
      const existingTicket = await this.ticketRepository.findOne({
        where: { title: title },
      });
      if (existingTicket) {
        throw new HttpException('Ticket already exists', HttpStatus.CONFLICT);
      }

      // Find all tickets with the same phase_id
      const ticketsInPhase = await this.ticketRepository.find({
        where: { phase_id: phase_id },
      });

      let order = 0; // Default value if no tickets exist in this phase
      if (ticketsInPhase.length > 0) {
        // Get the maximum order from those tickets
        const maxOrder = Math.max(
          ...ticketsInPhase.map((ticket) => ticket.order),
        );
        // Increment the maximum order by 1
        order = maxOrder + 1;
      }

      console.log('userId and phaseId', typeof user_id, typeof phase_id);
      // Create a new ticket
      const ticket = this.ticketRepository.create({
        title,
        description,
        user_id,
        phase_id,
        image: file.filename,
        completed: false,
        order: order,
      });
      const newTicket = await this.ticketRepository.save(ticket);

       // Check if the ticket already exists
       const findTicket = await this.ticketRepository.findOne({
        where: { id: newTicket.id },
      });

      
      return { message: 'Ticket created successfully', ticket: findTicket };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // return all the tickets.
  async findAll() {
    try {
      // Fetch all tickets from the database
      const tickets = await this.ticketRepository.find();
      return { tickets };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // return all the searched tickets.
  async findSearchedTickets(word: string) {
    try {
      // Fetch tickets whose title or description contains the provided word
      const tickets = await this.ticketRepository
        .createQueryBuilder('ticket')
        .where('ticket.title LIKE :word OR ticket.description LIKE :word', {
          word: `%${word}%`,
        })
        .getMany();

      return { tickets };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update The Ticket
  async update(
    id: number,
    updateTicketDto: UpdateTicketDataDto,
    file: Express.Multer.File,
  ) {
    try {
      // Find the ticket by ID
      const ticket = await this.ticketRepository.findOne({ where: { id } });
      // Check if the ticket exists
      if (!ticket) {
        throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
      }

      ticket.title = updateTicketDto.title || ticket.title;
      ticket.description = updateTicketDto.description || ticket.description;
      ticket.image = file.filename || ticket.image;

      console.log(updateTicketDto);
      // if(updateTicketDto.completed == 'on')
      //   ticket.completed = true;
      // else
      //   ticket.completed = false;

      // Save the updated ticket
      const updatedTicket = await this.ticketRepository.save(ticket);
      console.log('Updated Ticket', updatedTicket);
      return { message: 'Ticket updated successfully', ticket: updatedTicket };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'An error occurred while updating the ticket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a Ticket
  async remove(id: number) {
    try {
      // Find the ticket by ID
      const ticketToDelete = await this.ticketRepository.findOne({
        where: { id },
      });
      // Check if the ticket exists
      if (!ticketToDelete) {
        throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
      }

      // Delete the ticket
      await this.ticketRepository.remove(ticketToDelete);
      return { message: 'ticket deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Change the Order of the Ticket in its current phase
  async changeOrder(body, id: number) {
    try {
      let { currentPhaseTickets } = body;

      const phaseExists = await this.ticketRepository.findOne({
        where: { phase_id: id },
      });

      if (!phaseExists)
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Phase does not exist',
        };

      // Loop through currentPhaseTickets to update the order
      for (let i = 0; i < currentPhaseTickets.length; i++) {
        console.log(currentPhaseTickets[i])
        const ticketId = currentPhaseTickets[i].id;

        // Fetch the ticket from the database
        const fetchedTicket = await this.ticketRepository.findOne({where: { id: ticketId }});

        // Update the order of the fetched ticket
        fetchedTicket.order = i;

        // Save the updated ticket back to the database
        await this.ticketRepository.save(fetchedTicket);
      }

      return {
        status: HttpStatus.OK,
        message: 'Order Changed Successfully',
        // ticket: tickets
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error
      };
    }
  }

  // Change the Phase of the Ticket
  async changePhase(body, oldPhaseId: number, newPhaseId: number, ticketId: number) {
    try {
      let { oldPhaseTickets, newPhaseTickets } = body;

      const oldPhaseExists = await this.phaseRepository.findOne({
        where: { id: oldPhaseId },
      });

      if (!oldPhaseExists){
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Source Phase does not exist',
        };
      }
      const newPhaseExists = await this.phaseRepository.findOne({
        where: { id: newPhaseId },
      });

      console.log("New Phase Id:", newPhaseId)
      if (!newPhaseExists){
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Target Phase does not exist',
        };
      }

      // Find the ticket by ID
      const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } });
      // Check if the ticket exists
      if (!ticket) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Ticket Not Found',
        };
      }

      if(ticket.id == ticketId)
          ticket.phase_id = newPhaseId

      await this.ticketRepository.save(ticket);

      // console.log("New Phase Tickets", newPhaseTickets)
      // console.log("Old Phase Tickets", oldPhaseTickets)

      // Loop through newPhaseTickets to update the order
      for (let i = 0; i < newPhaseTickets.length; i++) {
        console.log(newPhaseTickets[i])
        const existingTicketId = newPhaseTickets[i].id;

        // Fetch the ticket from the database
        const fetchedTicket = await this.ticketRepository.findOne({where: { id: existingTicketId }})
        // Update the order of the fetched ticket
        fetchedTicket.order = i;
        // Save the updated ticket back to the database
        await this.ticketRepository.save(fetchedTicket);
      }

      // Loop through oldPhaseTickets to update them.
      for (let i = 0; i < oldPhaseTickets.length; i++) {
        console.log(oldPhaseTickets[i])
        const existingTicketId = oldPhaseTickets[i].id;
        // Fetch the ticket from the database
        const fetchedTicket = await this.ticketRepository.findOne({where: { id: existingTicketId }});
        // Update the order of the fetched ticket
        fetchedTicket.order = i;
        // Save the updated ticket back to the database
        await this.ticketRepository.save(fetchedTicket);
      }
      return {
        status: HttpStatus.OK,
        message: 'Phase Changed Successfully',
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error
      };
    }
  }

  // get tickets based on the array of users
  async findSearchedTicketsByUsers(body) {
    try {
      const userIds = body;
      // console.log("UserIds:",userIds)
      // console.log("UserIds Length:",userIds.length)
      if (userIds.length == 0) {
        const tickets = await this.ticketRepository.find();
        return { tickets, message: 'Here are all tickets' };
      }
      // Fetch tickets whose user_id matches userIds
      const tickets = await this.ticketRepository
        .createQueryBuilder('ticket')
        .where('ticket.user_id IN (:...userIds)', { userIds })
        .getMany();

      return { tickets };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
