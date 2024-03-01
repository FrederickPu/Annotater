import React from "react";
import ReactMarkdown from 'react-markdown';

class PDFReader extends React.Component {
    constructor(props) {
        super(props)
    
        this.state = { terms: null }
    }

    componentDidMount() {
        fetch('./Documentation.md')
            .then(response => response.text())
            .then(text => this.setState({ terms: text }));
        document.body.addEventListener('mouseup', this.onMouseUp);
    }

    componentWillUnmount() {
        document.body.removeEventListener('mouseup', this.onMouseUp);
    }

    onMouseUp = (e) => {
        let selectionEvent = window.getSelection();
        //console.log(selectionEvent)
    }

    render(){
        return(
            <>
                <ReactMarkdown>{this.state.terms}</ReactMarkdown>
            </>
        )
    }
}


export default PDFReader;