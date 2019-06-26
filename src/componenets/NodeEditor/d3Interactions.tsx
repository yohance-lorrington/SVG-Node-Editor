import * as d3 from 'd3';

import {UIScale,EditorState,currentConnection,ConnectionState,saveConnection,resetConnectionState} from './global';
const RADIUS_CONNECTOR = 5;
export function d3Zoom(){
    const zoom = d3.zoom()
    .filter(function(){
        return d3.event.button === 1 || d3.event.buttons === 0;
    })
    .scaleExtent([1, 5])
    .on('zoom', this.Editor ? zoomedE: zoomed);

    function zoomedE(){
        const {k, x, y} = d3.event.transform;
        UIScale.scale = k;
        UIScale.x = x;
        UIScale.y = y;
        contentWrap.attr('transform', `translate(${x},${y}) scale(${k})`);
    }
    function zoomed(){
        const {k, x, y} = d3.event.transform;
        contentWrap.attr('transform', `translate(${x},${y}) scale(${k})`);
    }
    const contentWrap = d3.select(this.ui);
    const svg = d3.select(this.svg);
    svg.call(zoom);
    svg.on("dblclick.zoom", null);
}

export function d3Drag(){
    let dragged = ()=> {
        let state = EditorState.Nodes[this.uuid];
        let currentConnections = EditorState.Connections;

        state.root.pos.x = (d3.event.sourceEvent.x-d3.event.subject.x-UIScale.x)/UIScale.scale;
        state.root.pos.y = (d3.event.sourceEvent.y-d3.event.subject.y-UIScale.y)/UIScale.scale;
    
        updateInputLines(state,this.uuid,currentConnections);
        updateOutputLines(state,this.uuid,currentConnections);

        div.style('left', `${(d3.event.sourceEvent.x-d3.event.subject.x-UIScale.x)/UIScale.scale}px`);
        div.style('top', `${(d3.event.sourceEvent.y-d3.event.subject.y-UIScale.y)/UIScale.scale}px`);
        
    }
    const drag = d3.drag()
        .on("drag", dragged);
    
    
    
    const div = d3.select(this.dragTarget);
    d3.select(this.handle.current).call(drag);
}

export function inputDraw(beginPos,index:number){
   currentConnection.input.uuid  = this.uuid;
    currentConnection.input.index = index;
    if(!currentConnection.lineObject){//is there no line being draw right now
        currentConnection.didBeginInput = true;

        currentConnection.lineObject = drawInputConnection(beginPos,()=>{clearLines(currentConnection);EditorState.Connections = inputClearLine(currentConnection,EditorState.Connections)});  
    }else{
        let newcurrentConnection  = removeLineIfBothInputs(currentConnection);
        currentConnection.lineObject = newcurrentConnection.lineObject;
        if(!!currentConnection.lineObject){
            currentConnection.lineObject = endInputConnection(beginPos,currentConnection.lineObject);
            if(isConnectionReferringToItself(currentConnection)){
                removeCurrentLine(currentConnection);    
            }
            removeMouseOnListener();
            EditorState.Connections = saveConnection(currentConnection, EditorState.Connections);
            resetConnectionState(currentConnection);
        }    
    }
    
}

export function outputDraw(endPos){
    currentConnection.output = this.uuid;   
    if(!!currentConnection.lineObject){//are we drawing a line right now
        let newcurrentConnection  = removeLineIfBothOutputs(currentConnection);
        currentConnection.lineObject = newcurrentConnection.lineObject;
        if(!!currentConnection.lineObject){
            currentConnection.lineObject = endOutputConnection(endPos,currentConnection.lineObject);  
            if(isConnectionReferringToItself(currentConnection)){
                removeCurrentLine(currentConnection);
            }
            removeMouseOnListener();
            EditorState.Connections = saveConnection(currentConnection, EditorState.Connections);
            resetConnectionState(currentConnection);
        }    
    }else{
        currentConnection.didBeginInput = false;
        currentConnection.lineObject = drawOutputConnection(endPos,()=>{clearLines(currentConnection)});
        
    }
}


function drawConnection(beginPos,isInputConnection:boolean,handleOnDrawMouseUp:Function){

    let editor = d3.select("#editor");
    let lineObject = createLineObject(beginPos,beginPos);
    document.addEventListener('selectstart',disableSelect);
    editor.on('mousemove', onMouseMove);
    function onMouseMove(){
        let endPos = d3.mouse(this);
        let point = {
            x: (endPos[0]-UIScale.x)/UIScale.scale,
            y:(endPos[1]-UIScale.y)/UIScale.scale
        }

        if(isInputConnection){//I want the end of the line to be associated with the output;
            lineObject.changeEndPoint(point);
        }else{
            lineObject.changeBeginPoint(point);
        }      
    }
    
    editor.on('mouseup', handleOnDrawMouseUp);
    return  lineObject;
}
function endConnection(endPos,isInputConnection:boolean,lineObject){
    let copyOfLineObject = {...lineObject};

    
    if(isInputConnection){ ////I want input to be associated with begin point
        copyOfLineObject.changeBeginPoint(endPos);
    }else{
        copyOfLineObject.changeEndPoint(endPos);
    }
    return copyOfLineObject;
   
}
function drawInputConnection(begPos,handleOnDrawMouseUp:Function){
    return drawConnection(begPos,true,handleOnDrawMouseUp);
}
function drawOutputConnection(endPos,handleOnDrawMouseUp:Function){
    return drawConnection(endPos,false,handleOnDrawMouseUp);
}
function isConnectionReferringToItself(connection:ConnectionState){
    return(connection.input.uuid ==  connection.output);
}
function removeLineIfBothInputs(currentConnection:ConnectionState){
    if(currentConnection.didBeginInput){
        return removeCurrentLine(currentConnection);
    }   
    return currentConnection;
}
function removeLineIfBothOutputs(currentConnection:ConnectionState){
    if(!currentConnection.didBeginInput){
        return removeCurrentLine(currentConnection);  
    }
    return currentConnection;
}
function endInputConnection(begPos,lineObject){
    return endConnection(begPos,true,lineObject);
}
function endOutputConnection(endPos,lineObject){
    return endConnection(endPos,false,lineObject);
}


function clearLines(currentConnection:ConnectionState){
  
    let q = document.querySelectorAll(":hover");
    let wow = q[q.length-1];
    if(!wow.classList.contains("connector")){
        removeCurrentLine(currentConnection);
    }
    removeMouseOnListener();
}
function inputClearLine(currentConnectionState:ConnectionState, currentConnections:Array<ConnectionState>){
    let line = currentConnectionState.lineObject;
    let begPos =   line.getBeginPoint();
    let endPos = line.getEndPoint();
    let distance = Math.sqrt(Math.pow(begPos.x -endPos.x ,2) + Math.pow(begPos.y -endPos.y,2) );
    
    if(distance < RADIUS_CONNECTOR){ //check if person was dragging 
        
        const  updatedConnections = currentConnections.filter(connectionObject => 
                                        !(connectionObject.input.uuid == currentConnectionState.input.uuid &&  
                                            connectionObject.input.index == currentConnectionState.input.index));//should remove the boii that was clickk
                                            
        const needToRemove = currentConnections.filter(connectionObject => 
                                        connectionObject.input.uuid == currentConnectionState.input.uuid &&  
                                        connectionObject.input.index == currentConnectionState.input.index );
        
        if(needToRemove.length != 0){
            needToRemove[0].lineObject.removeLine();
        }
        return updatedConnections; 
    }
    return currentConnections;

}


function updateInputLines(parentNode,currentNodeId:string,allCurrentConnections:Array<ConnectionState>){
    let inputs = parentNode.inputs;  
    let inputsToUpdate = allCurrentConnections.filter(connectionObject => connectionObject.input.uuid == currentNodeId);

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

function updateOutputLines(parentNode,currentNodeId:string,allCurrentConnections:Array<ConnectionState>){
    
    let outputsToUpdate = allCurrentConnections.filter(connectionObject => connectionObject.output == currentNodeId);
    for( let connectinObj of outputsToUpdate){
        if(connectinObj.lineObject != null){
            let point ={
                x: parentNode.root.pos.x -  parentNode.output.ofst.x,
                y: parentNode.root.pos.y - parentNode.output.ofst.y
            }
            connectinObj.lineObject.changeEndPoint(point);
        }

    }
    
}

function removeCurrentLine(currentConnection:ConnectionState){
    let copyofConnectionState = {...currentConnection};
    if(!!currentConnection.lineObject){
        copyofConnectionState.lineObject.removeLine();
        copyofConnectionState.lineObject = null;
    
    }
    return copyofConnectionState;
}
function removeMouseOnListener(){
    let editor = d3.select("#editor");
    editor.on('mousemove',null);
    editor.on('mouseup',null);

    document.removeEventListener('selectstart',disableSelect);
}
function disableSelect(event){
    event.preventDefault();
}
function createLineObject(beginPos,endPos){
    let lined3 = d3.select('#connections').append("line")
    .attr('x1', beginPos.x).attr('y1', beginPos.y).attr('x2', endPos.x).attr('y2', endPos.y)
    .attr('stroke', 'white')
    .attr('stroke-width', '2')
    .attr('stroke-linecap',"round");
    let lineObject = {
        line : lined3,
        changeBeginPoint: function(beginPoint) {
            this.line.attr('x1',beginPoint.x).attr('y1',beginPoint.y);
        },
        changeEndPoint: function(endPoint){
            this.line.attr('x2',endPoint.x).attr('y2',endPoint.y);
        },
        getBeginPoint: function(){
            return {
                x: parseInt(this.line.attr('x1')),
                y: parseInt(this.line.attr('y1'))
            }
        },
        removeLine: function(){
            this.line.remove();
        },
        getEndPoint: function(){
            return {
                x: parseInt(this.line.attr('x2')),
                y: parseInt(this.line.attr('y2'))
            }
        }
    };
    return lineObject;
}
/*this.nice.addEventListener('mousedown',(e)=>{
    const yaes = this.nice.getBoundingClientRect();
    const startPoint = {
        x: ((yaes.left+yaes.right)/2-UIScale.x)/UIScale.scale,
        y: ((yaes.top+yaes.bottom)/2-UIScale.y)/UIScale.scale
    }
    const endPoint = {
        x: e.x,
        y: e.y
    }
    function disableSelect(event){
        event.preventDefault();
    }
    document.addEventListener('selectstart',disableSelect);
    let editor = d3.select("#editor");
    let connections = d3.select("#connections");
    let line = connections.append("line")
        .attr('x1', startPoint.x)
        .attr('y1', startPoint.y)
        .attr('x2', (endPoint.x-UIScale.x)/UIScale.scale)
        .attr('y2', (endPoint.y-UIScale.y)/UIScale.scale)
        .attr('stroke', 'white')
        .attr('stroke-width', '1')
        .attr('stroke-linecap',"round");
    
    editor.on('mousemove', mousemove);
    function mousemove(){
        var m = d3.mouse(this);
        line.attr('x2', (m[0]-UIScale.x)/UIScale.scale)
            .attr('y2', (m[1]-UIScale.y)/UIScale.scale);
    }
    editor.on('mouseup', ()=>{
        let q = document.querySelectorAll(":hover");
        let wow = q[q.length-1];
        let rect = wow.getBoundingClientRect();
        if(wow.classList[0] == "input"){
            line.attr('x2', ((rect.left+rect.right)/2-UIScale.x)/UIScale.scale)
                .attr('y2', ((rect.top+rect.bottom)/2-UIScale.y)/UIScale.scale);
        }else{
            line.remove();
        }
        document.removeEventListener('selectstart',disableSelect);
        editor.on('mousemove', null);
        editor.on('mouseup',null)
    });
});*/