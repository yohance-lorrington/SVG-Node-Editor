import * as React from 'react';
import {FunctionComponent, useEffect, useState} from 'react';
import {d3Zoom} from '../UIinteractions';

import * as uuidv4 from 'uuid/v4';
import EditorBG from './EditorBG';
import ContextMenu from './ContextMenu';
import ExampleNode from '../Nodes/ExampleNode';
import ConstantNumber from '../Nodes/ConstantNumber';

import NodeList, {NodeProvider, NodeConsumer} from './EditorContext';
import { node } from 'prop-types';

//UI composed inside of SVG container to more easily handle complex transformations, such as zooming and panning.
const NodeEditor: FunctionComponent = ()=>{
    useEffect(d3Zoom.bind(this, true)); //enables panning and zooming via d3's zoom functionality, also updates the editor's state(non-react incase it needs to be used with a different front end solution)
    useEffect(()=>{
        this.svg.addEventListener('contextmenu', contextmenu);
        this.svg.addEventListener('click', e => {
            if(visible){
                showMenu(false);
                visible = false;
            }
        });
    });

    let [nodeList, setNodeList] = useState([
        <ExampleNode top={100} left={50}/>, 
        <ConstantNumber top={300} left={50}/>, 
        <ConstantNumber top={400} left={50}/>
    ]);

    let visible = false;
    let showMenu = state => {
        this.ctxMenu.style.display = state ? "block" : "none";
    }
    let contextmenu = (e)=>{
        e.preventDefault();
        
        this.ctxMenu.style.top = `${e.clientY}px`;
        this.ctxMenu.style.left = `${e.clientX}px`;
        visible = true;
        showMenu(true);
    }
    console.log(nodeList);
    return (
        <NodeProvider value={nodeList}>
        <EditorBG>
            <svg id="editor"  ref={svg => this.svg = svg} width="100%" height="100%" >
                <g width="100%" height="100%" ref={ui => this.ui = ui}>
                    <g width="100%" height="100%" id="connections"></g>
                    <foreignObject width="100%" height="100%" style={{overflow: 'visible'}}>
                        {
                            nodeList.map((node, index)=>{return node})
                        }
                    </foreignObject>
                </g>
            </svg>
        <ContextMenu setNodes={setNodeList} ref={ctxMenu => this.ctxMenu = ctxMenu}/>
        </EditorBG>
        </NodeProvider>
    );
}
export default NodeEditor;