import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User | null> {
        return this.usersRepository.findOne({where: {id}});
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({where: {email}});
    }

    async create(user: User): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
        return this.usersRepository.save(user);
    }

    async update(id: number, user: User): Promise<User | null> {
        await this.usersRepository.update(id, user);
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}
