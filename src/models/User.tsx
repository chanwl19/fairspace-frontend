import { Role } from './Role';

export class User {
    public _id: Object;
    public email: string;
    public status: string;
    public userId: string;
    public firstName?: string;
    public lastName?: string;
    public middleName?: string;
    public phoneNo? : string;
    public roles?: Role[];
    public accessToken?: string;
    public image? : string;

    constructor(){
        this._id = '';
        this.email = '';
        this.status = '';
        this.userId = '';
        this.firstName = '';
        this.lastName = '';
        this.phoneNo = '';
        this.roles = [];
        this.accessToken = '';
        this.image ='';
    }
}