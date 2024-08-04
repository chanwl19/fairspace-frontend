import { Facility } from './Facility';
import { TimeSlot } from './TimeSlot';

export class AvailableTimeSlot {
    public facility: Facility;
    public timeSlots : TimeSlot[];

    constructor(){
        this.facility = new Facility();
        this.timeSlots= [];
    }
}