import styled from 'styled-components';
import * as React from "react";

const Range = styled.input`
    width: 100%;
    border-radius: 3px;
    overflow: hidden;
    margin: 0;
    height: 18px;
    -webkit-appearance: none;
    background: #777;
    &::-webkit-slider-runnable-track {
        -webkit-appearance: none;
        margin-top: -1px;
    }
    &::-webkit-slider-thumb {
        width: 0px;
        -webkit-appearance: none;
        box-shadow: -500px 0 0 500px #a05e5e;
    }
    &:hover{
        cursor: e-resize;
    }
    &:focus{
        outline: none;
    }
`;

const InternalTitle = styled.div`
    width: 100%;
    label{
        pointer-events: none;
        font-size: 0.9em;
        padding: 1px;
        left: 15px;
        position: absolute;
        color: white;
        mix-blend-mode: overlay;
    }
`;

interface State{
    value: string;
}
interface NodeProps{
    title: string;
    setVal: Function;
}

class RangeInput extends React.Component<NodeProps,State>{
    constructor(props){
        super(props);
        this.state = {
            value: '0.500'
        }
    }
    handleChange(e){
        let val = parseFloat(e.target.value);
        this.props.setVal(val);
        this.setState({
            value: val.toFixed(3)
        });
    }
    render(){
        return(
            <InternalTitle>
                <label htmlFor="">{this.props.title}: {this.state.value}</label>
                <Range type="range" min="0" max="1" step="0.001" onChange={this.handleChange.bind(this)} value={this.state.value}/>
            </InternalTitle>
        );
    }
}
export default RangeInput;
