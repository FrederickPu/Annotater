import React from 'react';
import { TextSelection } from 'react-pdf-selection/components/TextSelection';

interface Color {
    red: number;
    green: number;
    blue: number
}

// we assume that all segments line together back to back
// eg: [0, 1, "green"], [2, 10, "white"], [11, 14, "green"]
function HighlightDisjoint({content, segments, onSelect}) {

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
          onSelect(startPos, endPos)
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

function Highlight({content, segments, onSelect}) {

    function combineColors(set: Set<Color>) : Color {
        let out: Color = {red: 0, green: 0, blue: 0}
        for (let color of set.keys()) {
            out.red += color.red
            out.green += color.green
            out.blue += color.blue
        }
        if (set.size == 0)
            return {red: 255, green: 255, blue:255}
        return {red: out.red / set.size, green: out.green / set.size, blue: out.blue / set.size}
    }

    let iterate: Array<[number, Color, Boolean]> = [];
    for (let i of segments) {
        iterate.push([i[0], i[2], true]);
        iterate.push([i[1], i[2], false]);
    }

    iterate.sort((a, b) => a[0] - b[0]);

    let res = [];
    let currentColorSet = new Set();
    let prevIndex = 0;

    for (let i of iterate) {
        console.log(Array.from(currentColorSet.keys()))

        if (i[2]) {
            if (prevIndex === i[0])
                continue;
            res.push([prevIndex, i[0] - 1, combineColors(currentColorSet)]);
            prevIndex = i[0];
        } else {
            if (prevIndex === i[0] + 1)
                continue;
            res.push([prevIndex, i[0], combineColors(currentColorSet)]);
            prevIndex = i[0] + 1;
        }

        if (i[2])
            currentColorSet.add(i[1]);
        else
            currentColorSet.delete(i[1])
    }

    if (prevIndex <= content.length - 1)
        res.push([prevIndex, content.length - 1, combineColors(currentColorSet)]);

    return <HighlightDisjoint content={content} segments={res} onSelect={onSelect}/>

}

export default Highlight;