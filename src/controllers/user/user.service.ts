import { DeleteResult, Not, Repository } from "typeorm";
import { myDataSource } from "../../app-data-source";
import { Role } from "../../entities/Role";
import { User } from "../../entities/User";
import { UserDto } from "../../types/user.type";
import { RoleService } from "../role/role.service";


const roleService = new RoleService();


export class UserService {
  private readonly usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = myDataSource.getRepository(User);
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users: User[] = await this.usersRepository.find({where:{
        username: Not('admin')
      }});  
      return users;
    } catch (error: any) {
      throw Error(error);
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user: User | null = await this.usersRepository.findOne({where:{id}});
      if (!user) {
        throw Error('User Not Found');
      }
      return user;
    } catch (error: any) {
      throw Error(error);
    }
  }

  async createUser(userDto: UserDto): Promise<User> {
    try {
    const role :Role = await roleService.getRoleById(userDto.role_id);
      const user: User = new User();
      user.username = userDto.username;
      user.name = userDto.name;
      user.password = userDto.password;
      user.role = role;
      user.hashPassword();
      return await this.usersRepository.save(user);
    } catch (error: any) {
      throw Error('Username already exist');
    }
  }

  async updateUser(userDto: UserDto, id: number): Promise<User> {
    try {
      const user: User = await this.getUserById(id);
      user.username = userDto.username;
      user.name = userDto.name;
      user.password = userDto.password;
      user.role_id = userDto.role_id;
      const updatedUser: User = await this.usersRepository.save(user);
      return updatedUser;
    } catch (error: any) {
      throw Error(error);
    }
  }

  async deleteUser(id: number): Promise<void> {
    const deleted: DeleteResult = await this.usersRepository.delete(id);
    if (deleted.affected === 0) {
      throw Error('User Not Found');
    }
  }
}
