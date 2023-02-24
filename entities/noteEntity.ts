import {Entity, ManyToOne, Property} from "@mikro-orm/core";
import {baseEntity} from "./baseEntity";
import {Users} from "./userEntity";

@Entity()
export class Notes extends baseEntity {
    @ManyToOne({type: Users})
    sender!: Users;

    @ManyToOne({type: Users})
    recipient!: Users;

    @Property({type: "date"})
    date!: string;

    @Property({type: "string", nullable: true})
    title: string;

    @Property({type: "string", nullable: true})
    message: string;

    @Property({type: "string", nullable: true})
    audio_key: string;

    constructor(sender: Users, recipient: Users, date: string, title: string, message: string, audio_key: string) {
        super();
        this.sender = sender;
        this.recipient = recipient;
        this.title = title;
        this.message = message;
        this.audio_key = audio_key;
        this.date = date;
    }
}