type page = {
    path: string;
}

export class Role {
    public _id: Object;
    public roleId: number;
    public roleName: string;
    public pages: page[]; 

    constructor(){
       this._id ='';
       this.roleId = 0;
       this.roleName ='';
       this.pages = [];
    }
}