import { Controller, Post, Body, Param, ValidationPipe, UsePipes, Get, UseGuards, HttpCode, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { ConfigurePasswordDto } from './dto/configure-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('users/signup')
  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  create(@Body() body: CreateUserDto) {
    let email = body.email
    let password = body.password
    let name = body.name
    let is_admin = body.is_admin
    return this.usersService.signup(email, password, name, is_admin);
  }

  @Post('users/signin')
  @HttpCode(200)
  findOne(@Body() body: SignInUserDto) {
    return this.usersService.signin(body);
  }

  @Post('users/configure-password')
  configurePassword(
    @Body() body: ConfigurePasswordDto
  )
  {
    console.log(body.email)
    return this.usersService.configurePassword(body.email)
  }
  
  @Post('users/change-password/:userId')
  changePassword(
    @Param('userId', ParseIntPipe) id: number,  
    @Body() body: ChangePasswordDto
  )
  {
    console.log(body.password)
    return this.usersService.changePassword(id, body.password)
  }

  @UseGuards(AuthGuard)
  @Get('admin/users')
  getAllUsers()
  {
    return this.usersService.getAllUsers();
  }
}