import * as React from 'react';
import {useState,useRef,useEffect} from 'react';
import Styled from 'styled-components';

const Inp = Styled.input`
    box-sizing: border-box;
    width: 100%;
    padding: 5px;
    font-size: 0.9em;
    border-radius: 3px 3px 0 0;
    background: #777;
    border: none;
    margin: 0;
    :focus{
        outline: none;
    }
`;
interface Props{
    title: string
}
const Title = React.forwardRef((props: Props, ref: React.Ref<HTMLDivElement>)=>{
    const [changeTitle, toggleState] = useState(false);
    const [title, setTitle] = useState(props.title);

    const inputRef = useRef();

    useEffect(()=>{
        if(changeTitle){
            (inputRef as any).current.focus()
        }
    });

    const p = (
        <p>{title}</p>
    );
    const input = (
        <Inp ref={inputRef} onChange={(e)=>{setTitle(e.target.value);}}defaultValue={title}/>
    );
    return(
        <div ref={ref}  className="title" onDoubleClick={(e)=>{toggleState(!changeTitle);}}>
            {changeTitle? input : p}
        </div>
    );
});

export default Title;