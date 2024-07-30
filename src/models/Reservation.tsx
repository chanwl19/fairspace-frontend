export class Reservation {
    public _id: Object;
    public startDate: Date;
    public endDate: Date ;
    public facilityName: String;

    constructor() {
        this._id = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.facilityName = '';
    }
}