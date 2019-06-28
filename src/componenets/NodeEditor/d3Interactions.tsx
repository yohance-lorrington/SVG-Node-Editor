import * as d3 from 'd3';

import {editorUI,EditorState,ConnectionState,EditorStateClass} from './global';

export function d3Zoom(isEditor){
    const zoom = d3.zoom()
        .filter(function(){
            return d3.event.button === 1 || d3.event.buttons === 0;
        })
        .scaleExtent([1, 5])
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

export function inputDraw(beginPos,index:number){
    if(!EditorState.isConnecting ){
        let newConnection = new ConnectionState();
        newConnection.input ={ uuid:this.uuid,index:index};
        newConnection.lineObject = drawInputConnection(beginPos,EditorState.htmlContainer,()=>{clearLines(newConnection,EditorState);});
        EditorState.addConnectionsState(newConnection);
        EditorState.beganOnInput = true;
        EditorState.isConnecting = true;
    }
    else{
        let workingConnection = EditorState.getLastConnection();
        workingConnection.input = {uuid:this.uuid,index:index};
        workingConnection.lineObject = endInputConnection(beginPos, workingConnection.lineObject);
        if(EditorState.beganOnInput ||
            (workingConnection.input.uuid == workingConnection.output)){
            workingConnection.lineObject.removeLine();
            EditorState.removeLastConnection();
        }
        EditorState.removeDupInputConnections(workingConnection);
        EditorState.isConnecting = false;
        removeMouseOnListener(EditorState.htmlContainer);
    } 
}

export function outputDraw(endPos){

    
    if(!EditorState.isConnecting){
        let newConnection = new ConnectionState();
        newConnection.output = this.uuid;
        newConnection.lineObject = drawOutputConnection(endPos,EditorState.htmlContainer,()=>{clearLines(newConnection,EditorState);});
        EditorState.addConnectionsState(newConnection);
        EditorState.beganOnInput = false;
        EditorState.isConnecting = true;
    }else{
        let workingConnection = EditorState.getLastConnection();
        workingConnection.output = this.uuid;
        workingConnection.lineObject = endOutputConnection(endPos,workingConnection.lineObject);
        if(!EditorState.beganOnInput ||
            (workingConnection.input.uuid == workingConnection.output)){
            workingConnection.lineObject.removeLine();
            EditorState.removeLastConnection();
        }
        EditorState.removeDupInputConnections(workingConnection);
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
        editorConnections.removeLastConnection();
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

class d3Line {
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