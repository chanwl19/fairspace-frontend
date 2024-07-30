export class SupportCase {
    public _id: Object;
    public subject: String;
    public openDate: Date;
    public resolveDate: Date | null;
    public closeDate: Date | null;
    public status: String;
    public message: String[];

    constructor() {
        this._id = '';
        this.openDate = new Date();
        this.resolveDate = null;
        this.closeDate = null;
        this.status = '';
        this.message = [];
        this.subject ='';
    }
}