import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Event } from './Event';

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn() 
    id:number;

    @Column({type:'bigint',name:'user_bot_id'})
    userBotId: number;

    @Column({type:'varchar',name:'full_name'})
    full_name:string;

    @Column({type:'timestamp',name:'last_used'})
    lastUsed:Date;

    @OneToMany(() => Event, (event) => event.member)
    events: Event[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
