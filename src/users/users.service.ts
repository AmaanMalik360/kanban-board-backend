import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInUserDto } from './dto/signin-user.dto';
import { Permissions } from 'src/permissions/entities/permission.entity';
import { UserPermissions } from 'src/userpermissions/entities/userpermission.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/helpers/mailer/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Permissions)
    private permissionRepository: Repository<Permissions>,
    @InjectRepository(UserPermissions)
    private userPermissionRepository: Repository<UserPermissions>,
    @Inject(EmailService) private emailService:EmailService

  ) {}

  // Signup Service
  async signup(email: string, password: string, name: string, is_admin: boolean ) {
    try {
      console.log(email);
      const userExists = await this.userRepository.findOne({ where: {email: email} });

      // console.log(userExists);
      if (userExists) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      let hashedPassword = await bcrypt.hash(password,10);
      let user = {email, password:hashedPassword, name, is_admin}
      // create method is not asynchronous
      let newUser = this.userRepository.create(user);
      newUser = await this.userRepository.save(newUser);

      // Create three new userPermissions
      const writePermission = await this.permissionRepository.findOne({ where: { name: 'Write' } });
      const editPermission = await this.permissionRepository.findOne({ where: { name: 'Edit' } });
      const deletePermission = await this.permissionRepository.findOne({ where: { name: 'Delete' } });

      const writeUserPermission = this.userPermissionRepository.create({
        user: newUser,
        permission: writePermission,
      });

      const editUserPermission = this.userPermissionRepository.create({
        user: newUser,
        permission: editPermission,
      });
      
      const deleteUserPermission = this.userPermissionRepository.create({
        user: newUser,
        permission: deletePermission,
      });

      let to = newUser.email;
      let subject = "Registration with Movies Corner.";
      let text = "You just signed up with Movies Corner. ";
      let html = ''
      this.emailService.sendEmail(to, subject, text, html);
      
      await this.userPermissionRepository.save([writeUserPermission, editUserPermission, deleteUserPermission]);

      return {message: 'User Created Successfully'};
    } 
    catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Signin Service
  async signin(signInUserDto: SignInUserDto) {
    try {
      let email = signInUserDto.email;
      let password = signInUserDto.password;

      // Check if the user exists
      const existingUser = await this.userRepository.findOne({ where: { email: email } });
      if (!existingUser) 
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

      // Check if the password is correct
      const matchPassword = await bcrypt.compare(password, existingUser.password);
      console.log("Match Password------>",matchPassword)
      if (!matchPassword) 
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

      // Find UserPermissions associated with the user
      const userPermissions = await this.userPermissionRepository.find({
        where: { user_id: existingUser.id }, relations: ['permission'], // the name of the relation
      });
      // Extract permission names from the found UserPermissions
      const permissionNames = userPermissions.map(
        (userPermission) => userPermission.permission.name,
      );

      // Create a JWT token
      const token = jwt.sign(
        { id: existingUser.id, permissions: permissionNames }, process.env.JWT_SECRET, { expiresIn: '6h' }
      );

      const user = {
        name: existingUser.name,
        email: existingUser.email,
        id: existingUser.id,
        is_admin: existingUser.is_admin,
      };

      return { message: 'User signed in successfully', user, token };
    } 
    catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers() {
    try {
      // Fetch all users from the database
      const users = await this.userRepository.find();
      return { users };
    } 
    catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async configurePassword(email: string){
    try {
      const user = await this.userRepository.findOne({ where: { email: email } });

       // Generate a token with an expiration time (e.g., 1 hour)
      const token = await bcrypt.hash(user.email + Date.now(), 10); // Use email and current time to create a unique token
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1); // Set expiration time to 1 hour from now

      // Include the token in the reset password link
      const resetLink = `http://localhost:3000/change-password/${user.id}?token=${token}`;
     
      let to = 'email';
      let subject = 'Password Reset Request';
      let text = '';
      let html = 
      `
        <p>You have requested to reset your password. Please follow the link to reset your password.</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>`
      ;

      this.emailService.sendEmail(to, subject, text, html)
      return {message: 'Reset Password Link Sent.'}
    } 
    catch (error) {
     throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }


  async changePassword(
    user_id: number,
    password: string
  )
  {
    try 
    {
      const user = await this.userRepository.findOne({ where: { id: user_id } });
      if (!user) 
        throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
      
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;

      await this.userRepository.save(user);
      return {message: 'Password Successfully Changed' }
    } 
    catch (error) {
      throw new HttpException(error.message,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
