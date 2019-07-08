import {selectContainer,createLine} from './UIinteractions';
import ASTNode from './Nodes/NodeParts/ASTNode';
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
    
    if(!EditorState.htmlContainer) 
        EditorState.htmlContainer = selectContainer();
    
    let root = this.dragTarget.getBoundingClientRect();
    let inputStates;
    if(this.inpRefs){
        let inputRects = [];
        for(var inRef of this.inpRefs){
            inputRects.push(inRef.current.getBoundingClientRect()) // Calculates bounding rectangle only once during initialization. 
        };
        let inpOffsets = [];
        for(var rect of inputRects){
            let offset = {
                x: (root.x  - (rect.left+rect.right)/2 )/editorUI.scale,
                y: (root.y  - (rect.top+rect.bottom)/2)/editorUI.scale
            }; // stores the position of the inputs as an offset from the nodes base location.
            inpOffsets.push(offset);
        }
        
        inputStates = inpOffsets.map((offset, i)=>{
            return{el: this.inpRefs[i].current, ofst: offset}
        });
    }
    let outputState;
    if(this.outRef){
        let outRect = this.outRef.current.getBoundingClientRect(); // Calculates bounding rectangle only once during initialization. 
        let outOffset = {
            x: (root.x  - (outRect.left+outRect.right)/2)/editorUI.scale,
            y: (root.y  - (outRect.top+outRect.bottom)/2)/editorUI.scale
        };
        outputState = {
            el: this.outRef.current,
            ofst: outOffset
        }; // stores the position of the output as an offset from the nodes base location.
    }
    
    EditorState.Nodes[this.uuid] = {
        root: {
            el:this.dragTarget,
            pos: {
                x: (root.x-editorUI.x)/editorUI.scale,
                y: (root.y-editorUI.y)/editorUI.scale
            }
        },
        inputs: inputStates,
        output: outputState,
        nodeFunction: this.ASTNode
    }
}
export function connectNodes(inputConnection:InputConnection,UUIDofNode2:string){
    let node1 = EditorState.Nodes[inputConnection.uuid];
    let node2 = EditorState.Nodes[UUIDofNode2];
    if(node1 != null && node2 != null){
        let node_1_Inputs = EditorState.Nodes[inputConnection.uuid].inputs;
       
        EditorState.removeInputConnection(inputConnection);
        let connection = new ConnectionState();
        if(typeof node_1_Inputs != "undefined"){
            let endPos = generateOutputPosition(node2);       
            let begPos = generateInputPosition(node1,inputConnection.index)
            connection.input = inputConnection;
            connection.output  = UUIDofNode2;
            connection.lineObject = createLine(begPos,endPos);

            EditorState.addConnection(connection);
            EditorState.Nodes[inputConnection.uuid].nodeFunction.setInput(EditorState.Nodes[UUIDofNode2].nodeFunction,inputConnection.index);
            EditorState.ASTRoot.resolve();
        }
    }
}
export function deleteNode(NodeUUID){
    let node1 = EditorState.Nodes[NodeUUID];

    if(node1 != null){
        let node_1_Inputs = node1.inputs;
        if(typeof node_1_Inputs != "undefined"){
            EditorState.removeAllInputConnections(NodeUUID);
            EditorState.removeOutputConnections(NodeUUID);

            delete EditorState.Nodes[NodeUUID];
        }
    }

}

export class EditorStateClass{
    public Nodes:any;
    private _beganOnInput:boolean;
    private _connecting:boolean;
    private _tempConnectionAddress:string = this.hash({uuid:'',index:-1});
    public _connections:Map<string,ConnectionState>;
    private _container:any;
    public ASTRoot: ASTNode;
    public rootID: string;
    public currentNode: string;
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
            for(let i:number = 0; i < numInputs.length; ++i){
                this.removeInputConnection({uuid:UUID,index:i})
            }
        }
    }
    removeInputConnection(inputConnection:InputConnection){

        let connection = this.findInputConnection(inputConnection);
        if(!!connection){ 
            connection.lineObject.removeLine();
            this._connections.delete(this.hash(connection.input));
            this.Nodes[connection.input.uuid].nodeFunction.resetInput(connection.input.index);
            this.ASTRoot.resolve();
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
                let point = generateOutputPosition(parentNode);
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
                let point = generateInputPosition(parentNode,connectionObject.input.index);
                connectionObject.lineObject.changeBeginPoint(point);
            }
    
        }
    }

}
function generateInputPosition(node,index){
    return {
        x: node.root.pos.x -  node.inputs[index].ofst.x,
        y: node.root.pos.y - node.inputs[index].ofst.y
    }
}
function generateOutputPosition(node){
    return {
        x: node.root.pos.x -  node.output.ofst.x,
        y: node.root.pos.y - node.output.ofst.y
    }
}
export const editorUI =  new UITransform(1,0,0);

export const EditorState = new EditorStateClass();

