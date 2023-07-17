import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Event } from './Event';

@Entity('members')
export class Member {
    @PrimaryGeneratedColumn() 
    id:number;

    @Column({type:'bigint',name:'user_bot_id'})
    userBotId: number;

    @Column({type:'varchar',name:'full_name',nullable:true})
    full_name:string;

    @Column({type:'timestamp',name:'last_used',nullable:true})
    lastUsed:Date;

    @OneToMany(() => Event, (event) => event.member)
    events: Event[];

    @Column({type:'varchar',default:'zero',nullable:true})
    step:string;

    @Column({name:'feed_back',type:'varchar',nullable:true})
    feedBack:string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
