import React from 'react';
import { TextSelection } from 'react-pdf-selection/components/TextSelection';


interface AppState {
  content: string,
  segments: [[number, number, string]] // disjoint segments (start, end, color)
}

// TODO:: make the selection indexing actually work
function Highlight({content, segments, onSelect}) {

  return (
    <>
      <div
        onMouseUp={(e: React.MouseEvent) => {
          let selectionEvent = window.getSelection();
          console.log(selectionEvent)
          console.log(selectionEvent?.anchorNode?.parentElement as HTMLElement)
          console.log(selectionEvent?.focusNode?.parentElement as HTMLElement)
          let startPos = 0
          let endPos = 0
          if (selectionEvent.anchorNode.parentElement.id != '')
            startPos = segments[parseInt(selectionEvent.anchorNode.parentElement.id)][0] + selectionEvent.anchorOffset
          else
            startPos = selectionEvent.anchorOffset
          if (selectionEvent.focusNode.parentElement.id != '')
            endPos = segments[parseInt(selectionEvent.focusNode.parentElement.id)][0] + selectionEvent.focusOffset
          else
            endPos = selectionEvent.focusOffset
          // onSelect(startPos, endPos)
          console.log(startPos, endPos)
        }}
      >
        <mark style={{backgroundColor: "white"}}>{content.slice(0, segments[0][0])}</mark>
        {
          segments.map((segment, i) => (
            <React.Fragment key={i}>
              <mark key={i} id={i} style={{ backgroundColor: segment[2] }} onClick={() => console.log(segment[2])}>{content.slice(segment[0], segment[1] + 1)}</mark>
              {i + 1 < segments.length &&
                content.slice(segment[1] + 1, segments[i + 1][0])}
            </React.Fragment>
          ))
        }
        <mark style={{backgroundColor: "white"}}>{content.slice(segments[segments.length - 1][1] + 1, content.length)}</mark>
      </div>
    </>
  )
}

export default Highlight;