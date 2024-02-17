import React from "react";

const link = "../../../public/Documentation.pdf";

const PDFReader = () => {
    return(
        <>
            <iframe src={link} width="100%" height="100%" />
        </>
    )
}


export default PDFReader;