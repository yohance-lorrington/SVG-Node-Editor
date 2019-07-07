import * as React from "react";
import * as enzyme from 'enzyme';
import Editor from "../src/componenets/NodeEditor/Editor/EditorBG"

describe('<Editor/>',()=>{
    test('it does a render :)',()=>{
        const wrapper = enzyme.shallow(<Editor/>);
        
        expect(wrapper.length).toBe(1);
    })
})