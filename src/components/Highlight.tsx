import React, { forwardRef } from 'react';
import { TextSelection } from 'react-pdf-selection/components/TextSelection';

interface Color {
    red: number;
    green: number;
    blue: number
}

interface HighlightProps {
    content: string;
    segments: Array<[number, number, Color]>;
    onSelect: Function
}
const HighlightDisjoint =  React.forwardRef<HTMLDivElement, HighlightProps> (
    ({content, segments, onSelect}, ref) => {
    
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
          //console.log(startPos, endPos)
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
    )
  }
)

const Highlight=  React.forwardRef<HTMLDivElement, HighlightProps>(
    ({content, segments, onSelect}, ref) => {

    function combineColors(set: Set<Color>) : Color {
        let out: Color = {red: 0, green: 0, blue: 0}
        let used = new Set();
        for (let color of set.keys()) {
          if(used.has(JSON.stringify(color))){
            continue;
          }
          out.red += color.red
          out.green += color.green
          out.blue += color.blue
          used.add(JSON.stringify(color));
        }
        if (set.size == 0)
            return {red: 255, green: 255, blue:255}
        return {red: out.red / used.size, green: out.green / used.size, blue: out.blue / used.size}
    }

    let iterate: Array<[number, Color, Boolean]> = [];
    for (let i of segments) {
      iterate.push([i[0], i[2], true]);
      iterate.push([i[1] + 1, i[2], false]);
    }

    iterate.sort((a, b) => a[0] - b[0]);

    let mapIterate = new Map();
    let iterateIndex: number[] = [];

    for(let i of iterate){
        if (mapIterate.has(i[0])){
          let newColor = mapIterate.get(i[0]).color;
          newColor.push(i[1]);
          let newIsStart = mapIterate.get(i[0]).isStart;
          newIsStart.push(i[2]);
          mapIterate.set(i[0], {
            color: newColor,
            isStart: newIsStart
          });
        }else{
          iterateIndex.push(i[0]);
          mapIterate.set(i[0], {
            color: [i[1]],
            isStart: [i[2]]
          });
        }
    }

    let res: (number | Color)[][] = [];
    let currentColorSet: Set<Color> = new Set();
    let prevIndex = 0;


    for (let i of iterateIndex){
      let curr = mapIterate.get(i);
      res.push([prevIndex, i - 1, combineColors(currentColorSet)]);
      prevIndex = i;
      for(let j = 0;j < curr.isStart.length;j++){
        if(!curr.isStart[j]){
          currentColorSet.delete(curr.color[j]);
        }
      }

      for(let j = 0;j < curr.isStart.length;j++){
          if(curr.isStart[j]){
            currentColorSet.add(curr.color[j]);
          }
      }
    }

    if (prevIndex <= content.length - 1)
        res.push([prevIndex, content.length - 1, combineColors(currentColorSet)]);

    return <HighlightDisjoint content={content} segments={res} onSelect={onSelect} ref={ref}/>

})

export default Highlight;