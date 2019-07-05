import {selectContainer,d3Line, shittyLine} from './UIinteractions';
/**
 * This file creates interfaces for all the differen types of information the editor has to keep track of. 
 * A manual state management is used instead of React's state system as all manipulations are happening directly
 * on the DOM via D3. 
 * This also let's us move away from react as our front-end framework if we want.
 */
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
// Uses the ref's and ASTNode to create the State object for each node. 
export function initNodeState(){
    let inputStates;
    if(this.inpRefs){
        let inputRects = [];
        for(var inRef of this.inpRefs){
            inputRects.push(inRef.current.getBoundingClientRect()) // Calculates boudning rectangle only once during initialization. 
        };
        let inpOffsets = [];
        for(var rect of inputRects){
            let offset = {
                x: (this.props.left - (rect.left+rect.right)/2),
                y: (this.props.top - (rect.top+rect.bottom)/2) - window.scrollY
            }; // stores the position of the inputs as an offset from the nodes base location.
            inpOffsets.push(offset);
        }
        
        inputStates = inpOffsets.map((offset, i)=>{
            return{el: this.inpRefs[i].current, ofst: offset}
        });
    }
    let outputState;
    if(this.outRef){
        let outRect = this.outRef.current.getBoundingClientRect(); // Calculates boudning rectangle only once during initialization. 
        let outOffset = {
            x: (this.props.left - (outRect.left+outRect.right)/2),
            y: (this.props.top - (outRect.top+outRect.bottom)/2) - window.scrollY
        };
        outputState = {
            el: this.outRef.current,
            ofst: outOffset
        }; // stores the position of the output as an offset from the nodes base location.
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
export function generateNodeInputNode(UUID){
    let numInputs = EditorState.Nodes[UUID].inputs;
    //need to check if undefined 
    if(typeof numInputs != "undefined"){
        EditorState.removeAllInputConnections(UUID);
        EditorState.removeOutputConnections(UUID);
    }

    let connection = new ConnectionState();
    connection.lineObject = shittyLine({x:0,y:0},{x:0,y:0});
    connection.input ={uuid:UUID, index:0};
    connection.output = 'whatever';
    EditorState.addConnection(connection);

    
}
export class EditorStateClass{
    public Nodes:any;
    private _beganOnInput:boolean;
    private _connecting:boolean;
    private _tempConnectionAddress:string = this.hash({uuid:'',index:-1});
    public _connections:Map<string,ConnectionState>;
    private _container:any;
    constructor(){
        this.Nodes = {};
        this._container = null;
        this._beganOnInput= false;
        this._connecting = false;
        this._connections= new Map();
    }
    private hash(inputConnection:InputConnection):string{
        return `${inputConnection.uuid}--${inputConnection.index}`
    }
    getLastConnection():ConnectionState{
        let connection = this._connections.get(this._tempConnectionAddress);
        this._connections.delete(this._tempConnectionAddress);
        return connection;
    }
    discardLastConnection(){
        this.getLastConnection();
    }
    sizeOfConnections():number{
        return this._connections.size;
    }
    push(connection:ConnectionState){
        this._connections.set(this._tempConnectionAddress,connection);
    }
    peekLastConnection():ConnectionState{
        return this._connections.get(this._tempConnectionAddress);
    }
    addConnection(connection:ConnectionState){
        this.removeInputConnection(connection.input);
        this._connections.set(this.hash(connection.input),connection);
    }
    updateConnectionLinesForNode(nodeId:string){
        this.updateInputsForNodeWithId(nodeId);
        this.updateOutputsForNodeWithId(nodeId);
    }
    findInputConnection(inputConnection:InputConnection){
        return this._connections.get(this.hash(inputConnection));
    }
    removeAllInputConnections(UUID:string){
        let numInputs = this.Nodes[UUID].inputs;
        //need to check if undefined 
        if(typeof numInputs != "undefined"){
            for(let i:number = 0; i < numInputs; ++i){
                this.removeInputConnection({uuid:UUID,index:i})
            }
        }
    }
    removeInputConnection(inputConnection:InputConnection){
        let connection = this.findInputConnection(inputConnection);
        if(!!connection){ 
             connection.lineObject.removeLine();
             this._connections.delete(this.hash(connection.input));
        } 
    }
    removeOutputConnections(outputUUID:string){
        const arrayOfInputConnections = Array.from(this._connections).map(([,connectinObj])=>connectinObj.output == outputUUID 
                                                                                ? connectinObj.input:null)
                                                                                .filter(hashConnectionString=> hashConnectionString != null);
        for (const inputconnection of arrayOfInputConnections) {   
            this.removeInputConnection(inputconnection);
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

    private updateOutputsForNodeWithId(id:string){
        let outputsToUpdate = Array.from(this._connections).map(([inputConnectionString,connectinObj])=>connectinObj.output == id  ? inputConnectionString:null)
                                                                .filter(hashConnectionString=> hashConnectionString != null);
        const parentNode = this.Nodes[id];
    
        for(let inputconnectionHashed of outputsToUpdate){
            let connection =this._connections.get(inputconnectionHashed);
            if( connection!= null){
                let point ={
                    x: parentNode.root.pos.x -  parentNode.output.ofst.x,
                    y: parentNode.root.pos.y - parentNode.output.ofst.y
                }
                connection.lineObject.changeEndPoint(point);
            }
        }
    }

    private updateInputsForNodeWithId(id:string){
        const parentNode = this.Nodes[id];
        let inputs = parentNode.inputs;
         
        let inputsToUpdate = Array.from(this._connections).map(([inputConnectionString,connectinObj])=>connectinObj.input.uuid == id  ? inputConnectionString:null)
                                                                .filter(hashConnectionString=> hashConnectionString != null);
        for(let inputconnectionHashed of inputsToUpdate){
            let connectionObject = this._connections.get(inputconnectionHashed);
            if(connectionObject != null){ //probably a stupid check 
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

