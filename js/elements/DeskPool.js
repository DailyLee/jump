import ElementPool from "./ElementPool";
import Desk from "./Desk";

export default class DeskPool extends ElementPool {
    constructor(max) {
        super(max,Desk)
    }

    recycle(item){
        console.log('recycle:'+item)
    }

}
