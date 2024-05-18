import React, { forwardRef } from 'react';
import { HighlightProps } from "./Highlight.tsx"

export const HighlightDisjointText = React.forwardRef<HTMLDivElement, HighlightProps<String, Number>>(
  ({ content, segments, onSelect, onSegmentClick }, ref) => {

    return (
      <div
        ref={ref}
        onMouseUp={(e: React.MouseEvent) => {
          let selectionEvent = window.getSelection();
          //console.log(selectionEvent)
          //console.log(selectionEvent?.anchorNode?.parentElement as HTMLElement)
          //console.log(selectionEvent?.focusNode?.parentElement as HTMLElement)
          // anchorNode: startNode
          // focusNode: endNode
          // ------seg_start-------position--------seg_end
          let startPos = segments[parseInt(selectionEvent.anchorNode.parentElement.id)][0] + selectionEvent.anchorOffset
          let endPos = segments[parseInt(selectionEvent.focusNode.parentElement.id)][0] + selectionEvent.focusOffset
          onSelect(Math.min(startPos, endPos), Math.max(startPos, endPos) - 1)

        }}
      >
        {
          segments.map((segment, i) => (
            <React.Fragment key={i}>
              <mark key={i} id={i} style={{ backgroundColor: `rgb(${segment[2].red}, ${segment[2].green}, ${segment[2].blue})` }} onClick={() => onSegmentClick(i)}>{content.slice(segment[0], segment[1] + 1)}</mark>
            </React.Fragment>
          ))
        }
      </div>
    )
  }
)