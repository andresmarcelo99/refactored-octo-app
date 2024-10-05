import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    
    @Get()
    async findAll(): Promise<User[]> {
        return await  this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<User> {
        try {
            const user = await this.usersService.findOne(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Failed to find user: ${error.message}`);
        }
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<User | null> {
        try {
            const user = await this.usersService.findByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Failed to find user by email: ${error.message}`);
        }
    }

    @Post()
    async create(@Body() user: User): Promise<User> {
        try {
            return await this.usersService.create(user);
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() user: User): Promise<User | null> {
        try {
            return await this.usersService.update(id, user);
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        try {
            await this.usersService.delete(id);
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
}
