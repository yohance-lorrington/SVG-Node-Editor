import * as React from "react";
import {d3Drag,inputDraw, outputDraw} from '../d3Interactions';
import {createInputs, createOutput} from './builders'
import {EditorState, initNodeState} from '../global';
import * as uuidv4 from 'uuid/v4';
import Node from './Node';

interface NodeProps{
    top: number;
    left: number;
}

class BaseNode extends React.Component<NodeProps> {
    dragTarget:any;
    handle:any;
    uuid: string;
    inpRefs: React.RefObject<HTMLDivElement>[];
    outRef:  React.RefObject<HTMLDivElement>;
    input: JSX.Element[];
    output: JSX.Element;
    line: any;
    constructor(props){
        super(props);
        this.uuid = uuidv4();

        let structure = {
            inputs: [
                'Image 1',
                'Image 2',
                'Image 3'
            ],
            output: 'Blend'
        }
        createInputs.bind(this)(structure);
        createOutput.bind(this)(structure)
    }
    componentDidMount(){
        d3Drag.bind(this)();
        initNodeState.bind(this)();
 
        
    }
    handleMouse(index){
        let parent = EditorState.Nodes[this.uuid];
        let referencePositon = parent.root.pos;
        let inputOffset = parent.inputs[index].ofst;

        let inputPosition = {
            x: referencePositon.x - inputOffset.x,
            y: referencePositon.y - inputOffset.y
        };
    
        inputDraw.bind(this)(inputPosition,index);
    }
    handleEndPoint(){
        let parent = EditorState.Nodes[this.uuid];
        let referencePositon = parent.root.pos;
        let outPutOffset = parent.output.ofst;
        let outputPosition = {
            x: referencePositon.x - outPutOffset.x,
            y: referencePositon.y - outPutOffset.y
        }
      
        outputDraw.bind(this)(outputPosition);
    
    }

    render(){
        return (
            <Node ref={dragTarget => this.dragTarget = dragTarget} style={{ top: `${this.props.top}px`, left:  `${this.props.left}px` }}>
                <div ref={handle => this.handle = handle} className="title"><p>Blend</p></div>
                <div className="connections">
                    <div className="inputs">
                        {this.input}
                    </div>
                    <div className="vr"></div>
                    <div className="outputs">
                        {this.output}
                    </div>
                </div>
            </Node>
        );
    }
}

export default BaseNode;