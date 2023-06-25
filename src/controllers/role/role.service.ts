import { DeleteResult, Repository } from "typeorm";
import { myDataSource } from "../../app-data-source";
import { Role } from "../../entities/Role";
import { RoleDto } from "../../types/role.type";
 

export class RoleService {
  private readonly rolesRepository: Repository<Role>;

  constructor() {
    this.rolesRepository = myDataSource.getRepository(Role);
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      const roles: Role[] = await this.rolesRepository.find();
      return roles;
    } catch (error: any) {
      throw Error(error);
    }
  }

  async getRoleById(id: number): Promise<Role> {
    try {
      const role: Role | null = await this.rolesRepository.findOne({where:{id}});
      if (!role) {
        throw Error('Role Not Found');
      }
      return role;
    } catch (error: any) {
      throw Error(error);
    }
  }

  async createRole(roleDto: RoleDto): Promise<Role> {
    try {
      const newRole: Role = new Role();
      newRole.role_name = roleDto.role_name;
      return await this.rolesRepository.save(newRole);
    } catch (error: any) {
      throw Error(error);
    }
  }

  async updateRole(roleDto: RoleDto, id: number): Promise<Role> {
    try {
      const role: Role = await this.getRoleById(id);
      role.role_name = roleDto.role_name;
      const updatedRole: Role = await this.rolesRepository.save(role);
      return updatedRole;
    } catch (error: any) {
      throw Error(error);
    }
  }

  async deleteRole(id: number): Promise<void> {
    const deleted: DeleteResult = await this.rolesRepository.delete(id);
    if (deleted.affected === 0) {
      throw Error('Role Not Found');
    }
  }
}
