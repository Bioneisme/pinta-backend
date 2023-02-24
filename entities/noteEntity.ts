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
    date!: Date;

    @Property({type: "string", nullable: true})
    title: string;

    @Property({type: "string", nullable: true})
    message: string;

    @Property({type: "string", nullable: true})
    audio_key: string;

    @Property({type: "boolean", default: false})
    isNotifiedF?: boolean;

    @Property({type: "boolean", default: false})
    isNotifiedS?: boolean;

    constructor(sender: Users, recipient: Users, date: Date, title: string, message: string, audio_key: string,
                isNotifiedF: boolean = false, isNotifiedS: boolean = false) {
        super();
        this.sender = sender;
        this.recipient = recipient;
        this.title = title;
        this.message = message;
        this.audio_key = audio_key;
        this.date = date;
        this.isNotifiedF = isNotifiedF;
        this.isNotifiedS = isNotifiedS;
    }
}