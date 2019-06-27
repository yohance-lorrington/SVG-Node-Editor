import * as React from "react";
import {createRef} from 'react';

export function createInputs(structure) {
    this.inpRefs = [];
    this.input = structure.inputs.map((name, i)=>{
        this.inpRefs.push(createRef());
        return (
            <div key={i} className="input">
                <div onMouseUp={this.handleConnection.bind(this, i)} onMouseDown={this.handleConnection.bind(this, i)} ref={this.inpRefs[i]} className="in connector"></div>
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
            <div onMouseUp={this.handleConnection.bind(this,null)} onMouseDown={this.handleConnection.bind(this,null)} ref={this.outRef} className="out connector"></div>
        </div>
    )
}