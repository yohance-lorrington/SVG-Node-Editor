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
    isSelfReferring():boolean{
        return this._input.uuid == this._output;
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
        return this._connections.pop();
    }
    discardLastConnection(){
        this._connections.pop();//this returns the last element 
    }
    sizeOfConnections():number{
        return this._connections.length;
    }
    push(connection:ConnectionState){
        this._connections.push(connection);
    }
    peekLastConnection():ConnectionState{
        return this._connections[this.sizeOfConnections()-1];
    }
    addConnection(connection:ConnectionState){
        this.removeInputConnection(connection.input);
        this.push(connection);
    }
    updateConnectionLinesForNode(nodeId:string){
        this.updateInputsForNodeWithId(nodeId);
        this.updateOutputsForNodeWithId(nodeId);
    }
    findInputConnection(inputConnection:InputConnection){
        const index = this._connections.findIndex(connectionObject=> connectionObject.input.uuid == inputConnection.uuid && 
                                                                            connectionObject.input.index == inputConnection.index);
        
        return {
            found: index != -1  ? true:false,
            index: index
        };  
    }
    removeInputConnection(inputConnection:InputConnection){
        let foundObject = this.findInputConnection(inputConnection);
        if(foundObject.found){ 
             this._connections[foundObject.index].lineObject.removeLine();
             this._connections.splice(foundObject.index,1);
        } 
                                                      
    }
    removeOutputConnections(outputUUID:string){
        const indices = this._connections.map((connectionbject,idx)=>connectionbject.output == outputUUID ? idx:-1).filter(index=> index != -1);
        for (const index of indices.reverse()) {   
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
    let inputStates;
    if(this.inpRefs){
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
        
        inputStates = inpOffsets.map((offset, i)=>{
            return{el: this.inpRefs[i].current, ofst: offset}
        });
    }
    let outputState;
    if(this.outRef){
        let outRect = this.outRef.current.getBoundingClientRect();
        let outOffset = {
            x: (this.props.left - (outRect.left+outRect.right)/2),
            y: (this.props.top - (outRect.top+outRect.bottom)/2) - window.scrollY
        };
        outputState = {
            el: this.outRef.current,
            ofst: outOffset
        };
    }
    if(!EditorState.htmlContainer) 
        EditorState.htmlContainer = selectContainer();
    EditorState.Nodes[this.uuid] = {
        root: {
            el:this.dragTarget,
            pos: {
                x: this.props.left,
                y: this.props.top
            }
        },
        inputs: inputStates,
        output: outputState,
        nodeFunction: this.ASTNode

    }
}
