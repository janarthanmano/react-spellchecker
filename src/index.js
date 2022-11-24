import React from 'react';
import ReactDOM from 'react-dom/client';

import $ from "jquery";
import ReactQuill from 'react-quill'
import "react-quill/dist/quill.snow.css";
import PropTypes from 'prop-types';
import reportWebVitals from './reportWebVitals';

import './index.css';
import './app.js';


const root = ReactDOM.createRoot(document.getElementById('root'));
const doneTypingInterval = 1000;
let checkingFr, checkingIt, checkingEnGb;

/*
 * Simple editor component that takes placeholder text as a prop
 */
class Editor extends React.Component {
    constructor (props) {
        super(props)
        this.state = { frHtml: '', itHtml: '', enGbHtml: '', theme: 'snow' }
        this.handleChangeFr = this.handleChangeFr.bind(this)
        this.handleChangeIt = this.handleChangeIt.bind(this)
        this.handleChangeEnGb = this.handleChangeEnGb.bind(this)
        this.spellCheck = this.spellCheck.bind(this)
    }

    spellCheck(html, lang){
        $.ajax({
            type: "POST",
            url: 'http://localhost:8000/controller.php',
            data: {html: html, lang: lang},
            dataType: 'json',
            success: function(data) {
                if(lang === 'fr'){
                    this.setState({ frHtml: data.html });
                    $('#f_tool').html(data.tool_tip);
                }else if(lang === 'it'){
                    this.setState({ itHtml: data.html });
                    $('#i_tool').html(data.tool_tip);
                }else{
                    this.setState({ enGbHtml: data.html });
                    $('#engb_tool').append(data.tool_tip);
                }
            }.bind(this),
        });
    }

    /*
     * Handle for french editor
     */
    handleChangeFr (html, delta, source) {
        console.log(source);
        clearTimeout(checkingFr);
        if(source === 'user'){
            this.setState({ frHtml: html });
            checkingFr = setTimeout(this.spellCheck, doneTypingInterval, html, 'fr');
        }
    }

    /*
     * Handle for italian editor
     */
    handleChangeIt (html, delta, source) {
        console.log(source);
        clearTimeout(checkingIt);
        if(source === 'user'){
            this.setState({ itHtml: html });
            checkingIt = setTimeout(this.spellCheck, doneTypingInterval, html, 'it');
        }
    }

    /*
     * Handle for english GB editor
     */
    handleChangeEnGb (html, delta, source) {
        console.log(source);
        clearTimeout(checkingEnGb);
        if(source === 'user'){
            this.setState({ enGbHtml: html });
            checkingEnGb = setTimeout(this.spellCheck, doneTypingInterval, html, 'en-gb');
        }
    }

    render () {
        return (
            <div style={{ width: 500, margin: '5% auto' }}>
                <div id={"f_editor_container"}>
                    <ReactQuill
                        theme={this.state.theme}
                        onChange={this.handleChangeFr}
                        value={this.state.frHtml}
                        modules={Editor.modules}
                        formats={Editor.formats}
                        placeholder={this.props.fr}
                        style={{margin : '0px 0px 60px 0px', height : 100}}
                    />
                    <div id={"f_tool"}></div>
                </div>
                <div id={"i_editor_container"}>
                    <ReactQuill
                        theme={this.state.theme}
                        onChange={this.handleChangeIt}
                        value={this.state.itHtml}
                        modules={Editor.modules}
                        formats={Editor.formats}
                        placeholder={this.props.it}
                        style={{margin : '0px 0px 60px 0px', height : 100}}
                    />
                    <div id={"i_tool"}></div>
                </div>
                <div id={"engb_editor_container"}>
                    <ReactQuill
                        theme={this.state.theme}
                        onChange={this.handleChangeEnGb}
                        value={this.state.enGbHtml}
                        modules={Editor.modules}
                        formats={Editor.formats}
                        placeholder={this.props.en_gb}
                        style={{margin : '0px 0px 60px 0px', height : 100}}
                    />
                    <div id={"engb_tool"}></div>
                </div>
            </div>
        )
    }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
]

/*
 * PropType validation
 */
Editor.propTypes = {
    placeholder: PropTypes.string,
}


/*
 * Render component on page
 */
root.render(
    <Editor fr={'French'} it={'Italian '} en_gb={'English-GB'}/>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
