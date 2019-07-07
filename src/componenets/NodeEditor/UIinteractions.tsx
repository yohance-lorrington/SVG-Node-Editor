import * as d3 from 'd3';

import {editorUI,EditorState,ConnectionState,deleteNode,EditorStateClass} from './EditorStates';

/**
 * This file contains d3 functionality tailored towards our specific use case. 
 * It exposes simple functions for enabling d3's user interaction.
 */

// Enables zooming and panning using the middle mouse button and scroll wheel when called upon a dom element.
export function d3Zoom(isEditor){
    const zoom = d3.zoom()
        .filter(function(){
            return d3.event.button === 1 || d3.event.buttons === 0;
        })
        .scaleExtent([0.1, 5])
        .on('zoom', isEditor ? zoomedE: zoomed);

    function zoomedE(){
        const {k, x, y} = d3.event.transform;
        editorUI.scale = k;
        editorUI.x = x;
        editorUI.y = y;
        requestAnimationFrame(()=>{
            contentWrap.attr('transform', `translate(${x},${y}) scale(${k})`);
        })
    }
    function zoomed(){
        const {k, x, y} = d3.event.transform;
        requestAnimationFrame(()=>{
            contentWrap.attr('transform', `translate(${x},${y}) scale(${k})`);
        })
    }
    const contentWrap = d3.select(this.ui);
    const svg = d3.select(this.svg);
    svg.call(zoom);
    svg.on("dblclick.zoom", null);
}

export function selectContainer(){
    return d3.select('#editor');
}
// Enables dragging behaviour via left click and drag. Used as above.
export function d3Drag(){
    let dragged = ()=> {
        let state = EditorState.Nodes[this.uuid];
        state.root.pos.x = (d3.event.sourceEvent.x-d3.event.subject.x-editorUI.x)/editorUI.scale;
        state.root.pos.y = (d3.event.sourceEvent.y-d3.event.subject.y-editorUI.y)/editorUI.scale;
        EditorState.updateConnectionLinesForNode(this.uuid);
        div.style('left', `${state.root.pos.x}px`);
        div.style('top', `${state.root.pos.y}px`);
    }
    const drag = d3.drag()
        .on("drag", dragged);
    const div = d3.select(this.dragTarget);
    d3.select(this.handle.current).call(drag);
}
// Line interface for creating and dynamically changing a line's start and end point.
export class d3Line {
    private line;
    constructor(container, beginPos, endPos){
        this.line = container.append("line")
            .attr('x1', beginPos.x).attr('y1', beginPos.y).attr('x2', endPos.x).attr('y2', endPos.y)
            .attr('stroke', 'white')
            .attr('stroke-width', '2')
            .attr('stroke-linecap',"round");
    }
    changeBeginPoint(beginPoint){
        this.line.attr('x1',beginPoint.x).attr('y1',beginPoint.y);
    }
    changeEndPoint(endPoint){
        this.line.attr('x2',endPoint.x).attr('y2',endPoint.y);
    }
    getBeginPoint(){
        return {
            x: parseInt(this.line.attr('x1')),
            y: parseInt(this.line.attr('y1'))
        }
    };
    removeLine(){
        this.line.remove();
    }
    getEndPoint(){
        return {
            x: parseInt(this.line.attr('x2')),
            y: parseInt(this.line.attr('y2'))
        }
    }
}
// Connection drawing state when beginning from a input socket
export function inputDraw(beginPos,index:number){
    // A new connection is being formed
    if(!EditorState.isConnecting ){
        let newConnection = new ConnectionState();
        newConnection.input = {uuid:this.uuid,index:index};
        newConnection.lineObject = drawInputConnection(beginPos,EditorState.htmlContainer,()=>{clearLines(newConnection,EditorState);});
        EditorState.push(newConnection);
        EditorState.beganOnInput = true;
        EditorState.isConnecting = true;
    }
    // A connection exists and needs to either be discarded or saved.
    else{
        
        let tempConnection = EditorState.peekLastConnection();
        tempConnection.input = {uuid:this.uuid, index: index};
        // If a connection is made between two inputs or is connecting to the same node it started from, DISCARD the connection.
        if(EditorState.beganOnInput || tempConnection.isSelfReferring()){
            EditorState.getLastConnection().lineObject.removeLine();
        }
        // If its a valid connection create a complete connection object and store it in the Editor state.
        else{
            tempConnection = EditorState.getLastConnection();
            tempConnection.lineObject = endInputConnection(beginPos,tempConnection.lineObject);            
            EditorState.addConnection(tempConnection);
            EditorState.Nodes[tempConnection.input.uuid].nodeFunction.setInput(EditorState.Nodes[tempConnection.output].nodeFunction,tempConnection.input.index);
            EditorState.ASTRoot.resolve();
        }
        EditorState.isConnecting = false;
        removeMouseOnListener(EditorState.htmlContainer);
    } 
}
// Connection drawing state when beginning from a output socket
export function outputDraw(endPos){
    // A new connection is being formed
    if(!EditorState.isConnecting){
        let newConnection = new ConnectionState();
        newConnection.output = this.uuid;
        newConnection.lineObject = drawOutputConnection(endPos,EditorState.htmlContainer,()=>{clearLines(newConnection,EditorState);});
        EditorState.push(newConnection);
        EditorState.beganOnInput = false;
        EditorState.isConnecting = true;
    }
    // A connection exists and needs to either be discarded or saved.
    else{
        let tempConnection = EditorState.peekLastConnection();
        tempConnection.output = this.uuid;
        // If a connection is made between two outputs or is connecting to the same node it started from, DISCARD the connection.
        if(!EditorState.beganOnInput || tempConnection.isSelfReferring()){
            EditorState.getLastConnection().lineObject.removeLine();
        }
        // If its a valid connection create a complete connection object and store it in the Editor state.
        else{
            tempConnection = EditorState.getLastConnection();
            tempConnection.lineObject = endOutputConnection(endPos,tempConnection.lineObject);
            EditorState.addConnection(tempConnection);
            EditorState.Nodes[tempConnection.input.uuid].nodeFunction.setInput(EditorState.Nodes[tempConnection.output].nodeFunction,tempConnection.input.index);
            EditorState.ASTRoot.resolve();
        }
        EditorState.isConnecting = false;
        removeMouseOnListener(EditorState.htmlContainer);
    }
}


function drawConnection(beginPos,isInputConnection:boolean,htmlContainer,handleOnDrawMouseUp:Function){
    let lineObject = new d3Line(d3.select("#connections"), beginPos, beginPos);
    document.addEventListener('selectstart',disableSelect);
    htmlContainer.on('mousemove', onMouseMove);
    function onMouseMove(){
        let endPos = d3.mouse(this);
        let point = {
            x: (endPos[0]-editorUI.x)/editorUI.scale,
            y:(endPos[1]-editorUI.y)/editorUI.scale
        }
        if(isInputConnection){//I want the end of the line to be associated with the output;
            lineObject.changeEndPoint(point);
        }else{
            lineObject.changeBeginPoint(point);
        }      
    }
    htmlContainer.on('mouseup', handleOnDrawMouseUp);
    return  lineObject;
}
function endConnection(endPos,isInputConnection:boolean,lineObject){    
    if(isInputConnection){ ////I want input to be associated with begin point
        lineObject.changeBeginPoint(endPos);
    }else{
        lineObject.changeEndPoint(endPos);
    }
    return lineObject;
   
}
function drawInputConnection(begPos,htmlContainer,handleOnDrawMouseUp:Function){
    return drawConnection(begPos,true,htmlContainer,handleOnDrawMouseUp);
}
function drawOutputConnection(endPos,htmlContainer,handleOnDrawMouseUp:Function){
    return drawConnection(endPos,false,htmlContainer,handleOnDrawMouseUp);
}
function endInputConnection(begPos,lineObject){
    return endConnection(begPos,true,lineObject);
}
function endOutputConnection(endPos,lineObject){
    return endConnection(endPos,false,lineObject);
}


function clearLines(currentConnection:ConnectionState,editorConnections:EditorStateClass){
    //need to fix this thing so it doesn't need to have the querySelector
    //the idea is use the fact that a valid a connection contains both a non-empty input id and output id 
    let q = document.querySelectorAll(":hover");
    let wow = q[q.length-1];
    if(!wow.classList.contains("connector")){
        currentConnection.lineObject.removeLine();
        editorConnections.discardLastConnection();
        editorConnections.isConnecting = false;
    }
    removeMouseOnListener(d3.select("#editor"));
}

function removeMouseOnListener(htmlContainer){
    htmlContainer.on('mousemove',null);
    htmlContainer.on('mouseup',null);

    document.removeEventListener('selectstart',disableSelect);
}
function disableSelect(event){
    event.preventDefault();
}

export function createLine(begPos,endPos){
    return new d3Line(d3.select("#connections"), begPos, endPos);
}
