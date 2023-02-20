import {Entity, Property} from "@mikro-orm/core";
import {baseEntity} from "./baseEntity";

@Entity()
export class Users extends baseEntity {
    @Property({type: "string"})
    phone!: string;

    @Property({type: "string"})
    deviceToken!: string;

    @Property({type: "string"})
    name!: string;


    constructor(phone: string, deviceToken: string, name: string) {
        super();
        this.phone = phone;
        this.deviceToken = deviceToken;
        this.name = name;
    }
}