import {Entity, ManyToOne, Property} from "@mikro-orm/core";
import {baseEntity} from "./baseEntity";
import {Users} from "./userEntity";

@Entity()
export class Tokens extends baseEntity {
    @ManyToOne({type: Users})
    user!: Users;

    @Property({type: "string"})
    token!: string;

    constructor(user: Users, token: string) {
        super();
        this.user = user;
        this.token = token;
    }
}