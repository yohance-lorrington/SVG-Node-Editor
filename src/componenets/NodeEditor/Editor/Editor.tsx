import * as React from 'react';
import {FunctionComponent, useEffect} from 'react';
import {d3Zoom} from '../d3Interactions';

import EditorBG from './EditorBG';
import BaseNode from '../Nodes/BaseNode';

const NodeEditor: FunctionComponent = ()=>{
    useEffect(d3Zoom.bind(this, true));
    
    return (
        <EditorBG >
            <svg id="editor"  ref={svg => this.svg = svg} width="100%" height="100%" >
                
                <g width="100%" height="100%" ref={ui => this.ui = ui}>
                    <g width="100%" height="100%" id="connections"></g>
                    <foreignObject width="100%" height="100%" style={{overflow: 'visible'}}>
                        <BaseNode top={100} left={50}/>
                        <BaseNode top={100} left={350}/>
                        <BaseNode top={300} left={200}/>
                        <BaseNode top={300} left={550}/>
                        <BaseNode top={500} left={200}/>
                        <BaseNode top={500} left={550}/>
                    </foreignObject>
                </g>
            </svg>
        </EditorBG>
    );
}
export default NodeEditor;