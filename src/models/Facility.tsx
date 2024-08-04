export class Facility {
    public _id: Object;
    public location: string;
    public type: string;
    public status: string; 
    public openTime: string; 
    public closeTime: string; 
    public capacity?: number | null; 
    public seatNumber?: number | null; 

    constructor(){
       this._id ='';
       this.location = '';
       this.type ='';
       this.status ='';
       this.openTime ='';
       this.closeTime ='';
       this.capacity = null;
       this.seatNumber = null;
    }
}