import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @Column({ type: 'varchar' })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false, name: 'passwordHash' })
  password: string;

  @Exclude()
  @Column({ type: 'varchar', default: UserRole.USER, name: 'userRole' })
  role: UserRole;

  @Exclude()
  @Column({ type: 'int', default: 1 })
  tokenVersion: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastLogin: Date;

  // Example of a one-to-many relationship
  // @OneToMany(() => Task, (task) => task.user)
  // tasks: Task[];
}
