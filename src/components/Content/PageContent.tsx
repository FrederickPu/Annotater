import React from "react";
import './Content.css';
import PDFReader from "./PDFReader";

interface CanvasProps{

}

interface CanvasState{

}

class PageContent extends React.Component<CanvasProps, CanvasState> {
    render(){
        return(
            <div className="pageContentContainer">
                <div className="pageContentDiv">
                    <PDFReader />
                </div>
            </div>
        )
    }
}


export default PageContent;