import React from "react";
import './PastSelector.css'

const PastSelector = () => {
    return(
        <div className="pastSelectorContainer">
            <div className="pastSelectorDiv">
                <select>
                    <option>Day 1</option>
                    <option>Day 2</option>
                </select>
            </div>
        </div>
    )
}


export default PastSelector;