import { Facility } from './Facility';

export class Reservation {
    public _id: Object;
    public reserveStartTime: Date;
    public reserveEndTime: Date;
    public status: string;
    public facility: Facility;
    public userId: string;

    constructor(){
        this._id = '';
        this.reserveStartTime= new Date();
        this.reserveEndTime = new Date();
        this.status = '';
        this.facility = new Facility();
        this.userId = '';
    }
}