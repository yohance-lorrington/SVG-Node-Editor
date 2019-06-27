import * as React from "react";
import {d3Drag,inputDraw, outputDraw} from '../d3Interactions';
import {createInputs, createOutput} from './builders'
import {EditorState, initNodeState} from '../global';
import * as uuidv4 from 'uuid/v4';
import Node from './Node';
import {createRef} from 'react';
import Title from './Title';

interface NodeProps{
    top: number;
    left: number;
}

class BaseNode extends React.Component<NodeProps> {
    uuid: string;
    dragTarget: React.Ref<HTMLDivElement>;
    inpRefs: React.Ref<HTMLDivElement>[];
    outRef : React.Ref<HTMLDivElement>;
    handle : React.Ref<HTMLDivElement>;
    input  : JSX.Element[];
    output : JSX.Element;
    line   : SVGLineElement;

    constructor(props){
        super(props);
        this.uuid = uuidv4();
        this.handle = createRef();
        let structure = {
            inputs: [
                'Image 1',
                'Image 2',
                'Image 3'
            ],
            output: 'Blend'
        };
        createInputs.bind(this)(structure);
        createOutput.bind(this)(structure);
    }
    componentDidMount(){
        d3Drag.bind(this)();
        initNodeState.bind(this)();
    }
    handleConnection(index){
        let parent = EditorState.Nodes[this.uuid];
        let referencePositon = parent.root.pos;
        if(index===null){
            let outputOffset = parent.output.ofst;
            let outputPosition = {
                x: referencePositon.x - outputOffset.x,
                y: referencePositon.y - outputOffset.y
            }
            outputDraw.bind(this)(outputPosition);
        }else{
            let inputOffset = parent.inputs[index].ofst;
            let inputPosition = {
                x: referencePositon.x - inputOffset.x,
                y: referencePositon.y - inputOffset.y
            };
            inputDraw.bind(this)(inputPosition,index);
        }
    }

    render(){
        return (
            <Node ref={dragTarget => this.dragTarget = dragTarget} style={{ top: `${this.props.top}px`, left:  `${this.props.left}px` }}>
                <Title ref={this.handle} title="Blend"/>
                
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