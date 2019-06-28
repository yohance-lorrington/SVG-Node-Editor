import {selectContainer} from '../NodeEditor/d3Interactions';
class UITransform {
    private _scale: number;
    private _x: number;
    private _y: number;
    constructor(scale:number, x:number, y:number){
        this._scale = scale;
        this._x = x;
        this._y = y;
    }
    get scale():number {
        return this._scale;
    }
    set scale(scale: number){
        this._scale = scale; 
    }
    get x():number {
        return this._x;
    }
    set x(x: number){
        this._x = x; 
    }
    get y():number {
        return this._y;
    }
    set y(y: number){
        this._y = y; 
    }
}

interface InputConnection{
    uuid:string,
    index:number
}
export class ConnectionState {
    private _lineObject:any;
    private _output:string;
    private _input:InputConnection;
    constructor(){
        this._lineObject = null;
        this._output = '';
        this._input = {
            uuid: '',
            index: -1
        };
    }

    get output():string {
        return this._output;
    }
    get input():InputConnection{
        return this._input;
    }
    get lineObject():any{
        return this._lineObject;
    }
    set output(id:string){
        this._output = id;
    }
    set input( inputObject:InputConnection){
        this._input = inputObject;
    }
    set lineObject(linez:any){
        this._lineObject = linez;
    }

}
export class EditorStateClass{
    public Nodes:any;
    private _beganOnInput:boolean;
    private _connecting:boolean;
    private _connections:Array<ConnectionState>;
    private _container:any;
    constructor(){
        this.Nodes = {};
        this._container = null;
        this._beganOnInput= false;
        this._connecting = false;
        this._connections= [];
    }
    getLastConnection():ConnectionState{
        return this._connections[this.sizeOfConnections() -1];
    }
    removeLastConnection(){
        this._connections.pop();//this returns the last element 
    }
    sizeOfConnections():number{
        return this._connections.length;
    }
    addConnectionsState(connection:ConnectionState){
        if(connection.input.uuid == connection.output)return;
         
        this._connections.push(connection);
    
       
    }
    removeDupInputConnections(connection:ConnectionState){
        const inputIndexes = this._connections.map((connectionObject,idx) => connectionObject.input.uuid == connection.input.uuid &&  
                                                                                connectionObject.input.index == connection.input.index ? idx:-1)
                                                                                .filter(index => index != -1);
        if(inputIndexes.length == 2){//there should only really be at most 2 elements 
           
            let firstIndex = inputIndexes[0];
            let secondIndex = inputIndexes[1];

            if(firstIndex<secondIndex){
                this._connections[firstIndex].lineObject.removeLine();
                this._connections.splice(firstIndex,1);
            }else{
                this._connections[secondIndex].lineObject.removeLine();
                this._connections.splice(secondIndex,1);
            }
        }                                                               

    }
    updateConnectionLinesForNode(nodeId:string){
        this.updateInputsForNodeWithId(nodeId);
        this.updateOutputsForNodeWithId(nodeId);
    }
    removeInputConnection(inputToRemove:InputConnection){
        const index = this._connections.findIndex(connectionObject => connectionObject.input.uuid == inputToRemove.uuid 
                                                                        && connectionObject.input.index == inputToRemove.index );

         if( index != -1){
             this._connections[index].lineObject.removeLine();
             this._connections.splice(index,1);
         }                                                            
    }
    get beganOnInput():boolean{
        return this._beganOnInput;
    }
    set beganOnInput(didItStartonInput:boolean){
        this._beganOnInput = didItStartonInput;
    }
    get isConnecting():boolean{
        return this._connecting;
    }
    set isConnecting(isconnection:boolean){
        this._connecting = isconnection;
    }
    get htmlContainer():any{
        return this._container;
    }
    set htmlContainer(container:any){
        this._container = container;
    }

    private updateInputsForNodeWithId(id:string){
        let outputsToUpdate = this._connections.filter(connectionObject => connectionObject.output == id);
        const parentNode = this.Nodes[id];
        for(let connectinObj of outputsToUpdate){
            if(connectinObj.lineObject != null){
                let point ={
                    x: parentNode.root.pos.x -  parentNode.output.ofst.x,
                    y: parentNode.root.pos.y - parentNode.output.ofst.y
                }
                connectinObj.lineObject.changeEndPoint(point);
            }
        }
    }

    private updateOutputsForNodeWithId(id:string){
        const parentNode = this.Nodes[id];
        let inputs = parentNode.inputs;
          
        let inputsToUpdate = this._connections.filter(connectionObject => connectionObject.input.uuid == id);
    
        for(let connectionObject of inputsToUpdate){
            if(connectionObject.lineObject != null){ //probably a stupid check 
                let point ={
                    x:  parentNode.root.pos.x -  inputs[connectionObject.input.index].ofst.x ,
                    y: parentNode.root.pos.y - inputs[connectionObject.input.index].ofst.y
                }
                connectionObject.lineObject.changeBeginPoint(point);
            }
    
        }
    }

}
export const editorUI =  new UITransform(1,0,0);

export const EditorState = new EditorStateClass();

export function initNodeState(){
    let inputRects = [];
    for(var inRef of this.inpRefs){
        inputRects.push(inRef.current.getBoundingClientRect())
    };
    let inpOffsets = [];
    for(var rect of inputRects){
        let offset = {
            x: (this.props.left - (rect.left+rect.right)/2),
            y: (this.props.top - (rect.top+rect.bottom)/2) - window.scrollY
        };
        inpOffsets.push(offset);
    }
    let outRect = this.outRef.current.getBoundingClientRect();
    let outOffset = {
        x: (this.props.left - (outRect.left+outRect.right)/2),
        y: (this.props.top - (outRect.top+outRect.bottom)/2) - window.scrollY
    }
    let inputStates = inpOffsets.map((offset, i)=>{
        return{el: this.inpRefs[i].current, ofst: offset}
    });
    if(!EditorState.htmlContainer) EditorState.htmlContainer = selectContainer();
    EditorState.Nodes[this.uuid] = {
        root: {
            el:this.dragTarget,
            pos: {
                x: this.props.left,
                y: this.props.top
            }
        },
        inputs: inputStates,
        output: {
            el: this.outRef.current,
            ofst: outOffset
        }

    }
}
