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
    top: ${props =>props.y}px;
    left: ${props => props.x}px;
    z-index: 0;
`;
const BezierCurve: React.SFC<BezierProps> = (props) => {
    let height: number = Math.abs(props.beginPointY - props.endPointY);
    let width: number = Math.abs(props.beginPointX - props.endPointX);
    let smallestX: number = Math.min(props.beginPointX, props.endPointX);
    let smallestY: number = Math.min(props.beginPointY, props.endPointY);
 
    return (
        <SVGContainer id="yeetHlp" >
            <svg xmlns="http://www.w3.org/2000/svg" height={`${height}`} style={{overflow: 'visible'}} viewBox={`0 0 ${width} ${height}`}>
                <path d={`M${props.beginPointX},${props.beginPointY} C${(width / 2)+smallestX},${props.beginPointY } ${(width / 2)+smallestX},${props.endPointY } ${props.endPointX},${props.endPointY }`} strokeWidth="3" stroke={props.color} fill="none" />
            </svg>
		</SVGContainer>
			);
}
export default BezierCurve;