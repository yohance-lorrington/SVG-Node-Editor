import styled from 'styled-components';
/**
 * Base styling for our node. TODO: add theming support for the nodes and editor.
 * @param props.singular is an indicator that the node is either input or output only.
 * The style is modified to allow the internal elements to take up the full width.
 */

const Node = styled.div`
    border-radius: 3px;
    width: ${props=>props.width}px;
    background: ${props=>props.color || 'white'};
    padding-bottom: 3px;
    position: absolute;
    z-index: 1;
    opacity: 0.7;
    .title p{
        padding: 5px;
        font-size: 0.9em;
        border-radius: 3px 3px 0 0;
        background:${props=>props.color|| 'white'};
        filter: brightness(80%);
        margin: 0;
    }
    .connections{
        display: flex;
        margin-top: 3px;
    }
    .outputs{
        margin-left: auto;
        width: ${props=>props.singular? '100%' : 'auto'}
    }
    .inputs{
        margin-right:auto;
        width: ${props=>props.singular? '100%' : 'auto'}
    }
    .output{
        display: flex;
        align-items: center;
        padding: 5px 10px;
    }
    .input{
        display: flex;
        align-items: center;
        padding: 5px 10px; 
    }
    .connector{
        width: 8px;
        height: 8px;
        border-radius: 100px;
        background: #fc9a9a;
        border: 1px solid black;
    }
    .vr{
        border:0.5px solid #888;
    }
    .input .connector{
        position: relative;
        left: -15px;
    }
    .output .connector{
        position: relative;
        left: 15px;
    }
    .output div{
        left: 15px;
    }
    .connector:hover{
        border: 1px solid #aaa;
    }
`;
export default Node;