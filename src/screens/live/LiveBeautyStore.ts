import { observable, action } from 'mobx';

class LiveBeautyStore {

    @observable public whiteness:number = 0;
    @observable public blur:number = 0;

    @observable public mirrored:boolean = false;

    @action.bound
    public setmirrored(m:boolean){
        this.mirrored = m;
    }
    
    @action.bound
    public setWhiteness(v:number){
        this.whiteness = v;
    }
    @action.bound
    public setBlur(v:number){
        this.blur = v;
    }
}

export default new LiveBeautyStore();