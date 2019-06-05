import * as React from "react";
import styled from 'styled-components';
interface BezierProps {
    beginPointX: number,
    beginPointY: number,
    endPointX: number,
    endPointY: number,
    color: string
}

const SVGContainer = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    display: flex;
    z-index: 0;
`;
const BezierCurve: React.SFC<BezierProps> = (props) => {
    let height: number = Math.max(Math.round(Math.abs(props.beginPointY - props.endPointY)),1);
    let width: number = Math.max(Math.round(Math.abs(props.beginPointX - props.endPointX)),1);
    let smallestX: number = Math.min(props.beginPointX, props.endPointX);
    let smallestY: number = Math.min(props.beginPointY, props.endPointY);
    console.log(props.beginPointY);
    console.log(props.endPointY);
    return (
        
        <SVGContainer id="yeetHlp" >
            <svg height={`${height}`} width={`${width}`} style={{overflow: 'visible'}} viewBox={`0 0 ${width} ${height}`}>
                <path d={`M${props.beginPointX},${props.beginPointY} C${100+smallestX},${props.beginPointY } ${(width-100)+smallestX},${props.endPointY } ${props.endPointX},${props.endPointY }`} strokeWidth="3" stroke={props.color} fill="none" />
            </svg>
		</SVGContainer>
			);
}
export default BezierCurve;