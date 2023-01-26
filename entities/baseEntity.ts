import {Entity, Property, PrimaryKey} from "@mikro-orm/core";
import moment from "moment";

@Entity()
export class baseEntity {
    @PrimaryKey({type: 'integer', autoincrement: true})
    id!: number;

    @Property({type: 'date'})
    created_at?: Date;

    @Property({onUpdate: () => moment().utc().toDate(), type: 'date'})
    updated_at?: Date;

    constructor() {
        this.created_at = moment().utc().toDate();
        this.updated_at = moment().utc().toDate();
    }
}