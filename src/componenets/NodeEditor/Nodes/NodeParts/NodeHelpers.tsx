import * as React from "react";
import {createRef} from 'react';

import {EditorState} from '../../EditorStates' 
import {inputDraw, outputDraw} from '../../UIinteractions';

import RangeInput from './RangeInput';
import ConstantInput from './ConstantInput';
/**
 * This file contains helper functions for creating Nodes using react. This includes generating repeated structures across nodes,
 * this includes inputs and outputs, along with their respective event handlers.
 * If a new node is created that doesn't follow the typcial input output design, you can simply implement its UI in a custom manner.
 * The connection event handlers can then be bound in a similar manner as seen in the 3 functions below.
 */
//The following functions initialize refs along with the actual dom elements for use in nodes.
export function createInputs(structure) {
    this.inpRefs = [];
    this.input = structure.inputs.map((name, i)=>{
        this.inpRefs.push(createRef());
        return (
            <div key={i} className="input">
                <div onMouseUp={handleConnection.bind(this, i)} onMouseDown={handleConnection.bind(this, i)} onClick={removeInputConnection.bind(this,i)} ref={this.inpRefs[i]} className="in connector"></div>
                {name}
            </div>
        )
    });
}
export function createOutput(structure) {
    this.outRef = createRef();
    this.output = (
        <div className="output">            
            {structure.output}
            <div onMouseUp={handleConnection.bind(this,null)} onMouseDown={handleConnection.bind(this,null)} ref={this.outRef} className="out connector"></div>
        </div>
    )
}
export function createInputOnly(){
    this.input = (
        <div className="input">
            <div onMouseUp={handleConnection.bind(this, 0)} onMouseDown={handleConnection.bind(this, 0)} onClick={removeInputConnection.bind(this,0)} ref={this.inpRefs[0]} className="in connector"></div>
            {this.state.value}
        </div>
    )
}
export function createOutputWithRange(structure){
    this.outRef = createRef();
    this.output = (
        <div className="output">            
            <RangeInput setVal={this.setValue.bind(this)} title={structure.output}/>
            <div onMouseUp={handleConnection.bind(this,null)} onMouseDown={handleConnection.bind(this,null)} ref={this.outRef} className="out connector"></div>
        </div>
    )
}
export function createOutputWithField(){
    this.outRef = createRef();
    this.output = (
        <div className="output">
            <ConstantInput setVal={this.setValue.bind(this)}/>
            <div onMouseUp={handleConnection.bind(this,null)} onMouseDown={handleConnection.bind(this,null)} ref={this.outRef} className="out connector"></div>
        </div>
    )
}
export function contextMenu(){
    
    console.log(this.uuid)
    console.log(EditorState.rootID);
    if(this.uuid == EditorState.rootID){
        EditorState.currentNode = undefined;
        return;
    }
    EditorState.currentNode = this.uuid;
}
//This handles what happens when a user begins or ends a connection, the connection drawing state is controlled by the Editor's state as that is where the connections are stored. 
export function handleConnection(index){
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
        // generateNodeInputNode.bind(this)(this.uuid);
        inputDraw.bind(this)(inputPosition,index);
    }
}

export function removeInputConnection(index){
    EditorState.removeInputConnection({uuid:this.uuid,index:index});
}
export function removeOutputConnections(){
    EditorState.removeOutputConnections(this.uuid);
}