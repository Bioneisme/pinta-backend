import {Entity, ManyToOne, Property} from "@mikro-orm/core";
import {baseEntity} from "./baseEntity";
import {Users} from "./userEntity";
import {ContactStatus} from "../types";

@Entity()
export class Relationships extends baseEntity {
    @ManyToOne({type: Users})
    user1!: Users;

    @ManyToOne({type: Users})
    user2!: Users;

    @Property({type: "numeric"})
    status!: ContactStatus

    constructor(user1: Users, user2: Users, status: ContactStatus) {
        super();
        this.user1 = user1;
        this.user2 = user2;
        this.status = status;
    }
}