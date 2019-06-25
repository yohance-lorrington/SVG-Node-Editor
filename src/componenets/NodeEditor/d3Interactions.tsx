import * as d3 from 'd3';
import {UIScale,EditorState} from './global';

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
        state.root.pos.x = (d3.event.sourceEvent.x-d3.event.subject.x-UIScale.x)/UIScale.scale;
        state.root.pos.y = (d3.event.sourceEvent.y-d3.event.subject.y-UIScale.y+window.scrollY)/UIScale.scale;
        
        this.line.attr('x1', state.root.pos.x - state.output.ofst.x)
                 .attr('y1', state.root.pos.y - state.output.ofst.y);
                 
        div.style('left', `${(d3.event.sourceEvent.x-d3.event.subject.x-UIScale.x)/UIScale.scale}px`);
        div.style('top', `${(d3.event.sourceEvent.y-d3.event.subject.y-UIScale.y+window.scrollY)/UIScale.scale}px`);
    }
    const drag = d3.drag()
        .on("drag", dragged);
    
    
    const div = d3.select(this.dragTarget);
    d3.select(this.handle.current).call(drag);
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
        if(wow.classList[0] == "in"){
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