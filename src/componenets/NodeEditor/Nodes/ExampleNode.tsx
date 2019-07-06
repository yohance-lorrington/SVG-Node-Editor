import * as React from "react";
import {createRef} from 'react';
import * as uuidv4 from 'uuid/v4';

import {d3Drag} from '../UIinteractions';
import {createInputs, createOutput} from './NodeParts/NodeHelpers';
import {initNodeState} from '../EditorStates';


import Node from './NodeParts/Node';
import Title from './NodeParts/Title';
import NodeProps from './NodeParts/NodeProps';
import ASTNode from './NodeParts/ASTNode';

/**
 * The base node serves as an example of how the nodes in our Editor are created. 
 * Rather than rely on inheritance, and creating node heirarchies that are unecessarily deep,
 * we chose to create nodes by defining the structure, used to define the visual reprsentation, 
 * and then by seperately combining the visual elements with the ASTNode, which is the actual
 * evaluation engine. Any necesasry variables and state information can be contained in this componenet,
 * which can then directly act as an interface between the AST and the UI.
 * 
 * Required parameters for creating a functional node:
 * @param uuid is a unique identifier for each node instance
 * @param dragTarget and @param handle both work together to allow for the dragging behaviour, 
 * they can be one and the same depending on your specific implementation, but we decided to only allow a small portion to be used as the handle.
 * Semi-required parameters:
 * @param input and @param output are required if the node is to interact with other nodes, a node should have at least one input or output,
 * but it is common for it to have a combination of both.
 * ~A node can have any number of inputs but must only have one output. At least in this version of the Editor.~
 * @param ASTNode is the Abstract syntax tree's representation of our node, If the node is to perform any function this is required.
 * The AST node should be initialized with default functionality so as to allow for an unconnected node to function without uknown errors.
 * The AST node can interact with class variables if the function passed during its construction is an arrow function. Otherwise use regular function to indicate it is independant of the overall node state.
 * 
 * You can add any other parameters as needed for keeping track of local state or information. These would typically be used as an interface between the node and AST node.
 * 
 * There are currently a few helper functions that help build the visual elements of the node based on a predefined structure, for more information on how they behave see NodeHelpers.tsx
 * The node's state is initialized when it has mounted and has a DOM representation. 
 * We elected to not use the virtual dom to manipulate the UI for added performance, and it allowed us to use D3 directly which greatly simplified the code from previous implementations. 
 */

 // A version of the node using react hooks was attempted but had issues with ref uniqueness. 
 // TODO: Reimplement an example node using react hooks to move towards a more functional composition of components.
 
class ExampleNode extends React.Component<NodeProps> {
    uuid: string;
    title: string;
    dragTarget: HTMLDivElement;
    handle : React.Ref<HTMLDivElement>;
    inpRefs: React.Ref<HTMLDivElement>[];
    outRef : React.Ref<HTMLDivElement>;
    input  : JSX.Element[];
    output : JSX.Element;
    ASTNode: ASTNode;
    
    constructor(props){
        super(props);
        //initialize UI elements
        this.uuid = props.uuid;
        this.handle = createRef();
        let structure = {
            title: "Add",
            inputs: [
                'Number 1',
                'Number 2'
            ],
            output: 'Sum'
        };
        this.title = structure.title;
        createInputs.bind(this)(structure);
        createOutput.bind(this)(structure);
        //initialize AST elements
        let inputs:Array<ASTNode> = new Array<ASTNode>(3);
        this.ASTNode = new ASTNode(inputs, function(){
            console.log(this.inputs.length)
        });
        //this.ASTNode.resolve();
    }
    componentDidMount(){
        d3Drag.bind(this)();
        initNodeState.bind(this)();
        this.dragTarget.addEventListener('contextmenu',(e)=>{
            e.stopPropagation();
        })
    }
    render(){
        return (
            <Node width={200} ref={dragTarget => this.dragTarget = dragTarget} style={{ top: `${this.props.top}px`, left:  `${this.props.left}px` }}>
                <Title ref={this.handle} title={this.title}/>
                
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

export default ExampleNode;