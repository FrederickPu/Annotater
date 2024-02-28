import React from 'react';
import { TextSelection } from 'react-pdf-selection/components/TextSelection';

interface Color {
    red: number;
    green: number;
    blue: number
}

// TODO:: make the selection indexing actually work
// we assume that all segments line together back to back
// eg: [0, 1, "green"], [2, 10, "white"], [11, 14, "green"]
// future name for component: HighlightDisjoint
function Highlight({content, segments, onSelect}) {

  return (
    <>
      <div
        onMouseUp={(e: React.MouseEvent) => {
          let selectionEvent = window.getSelection();
          console.log(selectionEvent)
          console.log(selectionEvent?.anchorNode?.parentElement as HTMLElement)
          console.log(selectionEvent?.focusNode?.parentElement as HTMLElement)
          // anchorNode: startNode
          // focusNode: endNode
          // ------seg_start-------position--------seg_end
          let startPos = segments[parseInt(selectionEvent.anchorNode.parentElement.id)][0] + selectionEvent.anchorOffset
          let endPos = segments[parseInt(selectionEvent.focusNode.parentElement.id)][0] + selectionEvent.focusOffset
          // onSelect(startPos, endPos)
          console.log(startPos, endPos)
        }}
      >
        {
          segments.map((segment, i) => (
            <React.Fragment key={i}>
              <mark key={i} id={i} style={{ backgroundColor: `rgb(${segment[2].red}, ${segment[2].green}, ${segment[2].blue})` }} onClick={() => console.log(segment[2])}>{content.slice(segment[0], segment[1] + 1)}</mark>
            </React.Fragment>
          ))
        }
      </div>
    </>
  )
}

export default Highlight;