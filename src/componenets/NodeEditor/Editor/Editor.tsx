import * as React from 'react';
import {FunctionComponent, useEffect} from 'react';
import {d3Zoom} from '../UIinteractions';

import EditorBG from './EditorBG';
import ExampleNode from '../Nodes/ExampleNode';
import ConstantNumber from '../Nodes/ConstantNumber'

//UI composed inside of SVG container to more easily handle complex transformations, such as zooming and panning.
const NodeEditor: FunctionComponent = ()=>{
    useEffect(d3Zoom.bind(this, true)); //enables panning and zooming via d3's zoom functionality, also updates the editor's state(non-react incase it needs to be used with a different front end solution)
    return (
        <EditorBG>
            <svg id="editor"  ref={svg => this.svg = svg} width="100%" height="100%" >
                <g width="100%" height="100%" ref={ui => this.ui = ui}>
                    <g width="100%" height="100%" id="connections"></g>
                    <foreignObject width="100%" height="100%" style={{overflow: 'visible'}}>
                        <ExampleNode top={100} left={50}/>
                        <ConstantNumber top={300} left={50}/>
                        <ConstantNumber top={400} left={50}/>
                    </foreignObject>
                </g>
            </svg>
        </EditorBG>
    );
}
export default NodeEditor;