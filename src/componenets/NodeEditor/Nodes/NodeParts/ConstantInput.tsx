import styled from 'styled-components';
import * as React from "react";

const Const = styled.input`
    width: 100%;
    border: none;
    overflow: hidden;
    margin: 0;
    -webkit-appearance: none;
    background: transparent;
    &::-webkit-inner-spin-button {
        background: red;
    }
    &:focus{
        outline: none;
    }
`;
interface State{
    value: string;
}
interface NodeProps{
    setVal: Function;
}

class ConstantInput extends React.Component<NodeProps,State>{
    constructor(props){
        super(props);
        this.state = {
            value: '1'
        }
    }
    handleChange(e){
        if(e.target.value == ''){
            e.target.value = '0'
        }
        else if(e.target.value[0]==='0'&&e.target.value.length>1){
            e.target.value = e.target.value.replace(/^0+/, '')
        }
        let val = parseFloat(e.target.value);
        this.props.setVal(val);
        this.setState({
            value: e.target.value
        });
    }
    render(){
        return(
            <>
                <Const type="number" onChange={this.handleChange.bind(this)} value={this.state.value}/>
            </>
        );
    }
}
export default ConstantInput;
