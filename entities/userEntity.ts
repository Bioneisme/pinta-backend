import {Entity, Property} from "@mikro-orm/core";
import {baseEntity} from "./baseEntity";

@Entity()
export class Users extends baseEntity {
    @Property({type: "string"})
    phone!: string;

    @Property({type: "string"})
    deviceToken!: string;


    constructor(phone: string, deviceToken: string) {
        super();
        this.phone = phone;
        this.deviceToken = deviceToken;
    }
}