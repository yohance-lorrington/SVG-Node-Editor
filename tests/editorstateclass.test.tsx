import {EditorStateClass,ConnectionState} from "../src/componenets/NodeEditor/EditorStates";

describe('default EditorState', ()=>{
    let defaultEditorState = new EditorStateClass();
    
    test('default editorState should be empty',()=>{
        expect(defaultEditorState.sizeOfConnections()).toBe(0);
    })

    test('default editorState should return null for last connection',()=>{
        expect(defaultEditorState.getLastConnection()).toBeFalsy();
    })
    
    test('nodes inside editorState should be empty',()=>{
        expect(Object.keys(defaultEditorState.Nodes)).toHaveLength(0);
    })
    test('default html container should be null',()=>{
        expect(defaultEditorState.htmlContainer).toBeNull();
    })
});

describe('adding and removing temp connection in EditorState',()=>{
    let defaultEditorState = new EditorStateClass();
    let connection = new ConnectionState();

    test('editor state can push temp connection',()=>{
        defaultEditorState.push(connection);
        expect(defaultEditorState.peekLastConnection()).toBeDefined();
    });

    test('editor state can return temp connection',()=>{
        expect(defaultEditorState.peekLastConnection()).toEqual(connection);
    });

    test('editor state can discard temp connection',()=>{
        defaultEditorState.discardLastConnection();
        expect(defaultEditorState.sizeOfConnections()).toBe(0);
    });
});

describe('adding and removing connections in EditorState',()=>{
    let defaultEditorState = new EditorStateClass();
    let connection = new ConnectionState();
    connection.input = {uuid: 'inputthings',index:0};
    connection.output = 'outputthings';

    test('can add connection to the editorstate',()=>{
        defaultEditorState.addConnection(connection);
        expect(defaultEditorState.sizeOfConnections()).toBe(1);
    });
    test('can find connection of a given input',()=>{
        expect(defaultEditorState.findInputConnection(connection.input)).toEqual(connection);
    });
    test('return undefined if does not find a connection for a input',()=>{
        expect(defaultEditorState.findInputConnection({uuid:'crap',index:0})).toBeUndefined();
    });
    //TODO need to decouple some of the methods of EditorSTATE
    
    // test('can remove connection for a given input',()=>{
    //     defaultEditorState.removeInputConnection(connection.input);
    //     expect(defaultEditorState.findInputConnection(connection.input)).toBeUndefined();
    // })
})