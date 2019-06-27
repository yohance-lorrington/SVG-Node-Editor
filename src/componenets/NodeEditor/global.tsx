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
export const editorUI =  new UITransform(1,0,0);


export let currentConnection:ConnectionState ={
    didBeginInput:false,
    lineObject: null,
    input:{
        uuid:null,
        index:-1
    },
    output:null
};

export interface ConnectionState{
    didBeginInput:boolean,
    lineObject:any,
    input:{
        uuid: string,
        index: number,
    },
    output:string
}
export const EditorState = {
    Nodes: {},
    Connections: Array<ConnectionState>(),
}
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

/**
 * The method will take connection state and will return a new array of connections with the new connection state added. 
 * If the connection state is self-refering (its input and output are refering to eachother) the new array will be equal to  prevConnections.
 * @param connectionToSave connection state used to either add or updated to the previous connections 
 * @param prevConnections  array of previous connections
 * @returns	Array<ConnectionState> will return a new array with the connection state added or a new array with a modified element
 * 
 * @example  [dumbyThicc]= saveConnection(dumbyThicc, [])
 * @example [thicc, updatedThiccer]   = saveConnection(updatedThiccer,[thicc,thiccer])
 * 
 */
export function saveConnection(connectionToSave:ConnectionState,prevConnections:Array<ConnectionState>){
    
    let copyOfCurrentConnections = [...prevConnections]; //pretty sure theses are all shallow copies.

    if(connectionToSave.input.uuid == connectionToSave.output){
        
        return copyOfCurrentConnections;
    }
    
    //look at our previous connections and return an non empty if our current node already exist in previous connections.  
    const foundConnection = copyOfCurrentConnections.filter(connectionObject => 
                                                connectionObject.input.uuid == connectionToSave.input.uuid &&  
                                                connectionObject.input.index == connectionToSave.input.index); 
    
    if(foundConnection.length == 0 ){ //is this a new connection
        let copyObject:ConnectionState = {...connectionToSave}; // create a deep copy of our current connection state
        copyObject.didBeginInput = connectionToSave.didBeginInput;
        copyObject.input =  Object.assign({},connectionToSave.input);
        copyObject.lineObject = connectionToSave.lineObject;
        copyObject.output = connectionToSave.output;

        copyOfCurrentConnections.push(copyObject);//add the newly copied connection state to the array. 

    }else{
        //just update connections don't make a new one;
        foundConnection[0].lineObject.removeLine();
        foundConnection[0].lineObject = connectionToSave.lineObject;
        foundConnection[0].output = connectionToSave.output;
    }
    
    
    return copyOfCurrentConnections;
   
}
export function resetConnectionState(currentConnection:ConnectionState){
    currentConnection.input.index = -1;
    currentConnection.input.uuid = null;
    currentConnection.output= null;
    currentConnection.lineObject = null;
}