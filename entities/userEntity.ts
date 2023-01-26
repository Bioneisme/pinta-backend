import {Entity, Property} from "@mikro-orm/core";
import {baseEntity} from "./baseEntity";

@Entity()
export class Users extends baseEntity {
    @Property({type: "string"})
    phone!: string;


    constructor(phone: string) {
        super();
        this.phone = phone;
    }
}