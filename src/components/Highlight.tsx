import React, { forwardRef } from 'react';

export interface Color {
    red: number;
    green: number;
    blue: number
}

interface HighlightProps {
    content: string;
    segments: Array<[number, number, Color]>;
    onSelect: Function;
    onSegmentClick: (number) => void;
}

const HighlightDisjoint =  React.forwardRef<HTMLDivElement, HighlightProps> (
    ({content, segments, onSelect, onSegmentClick}, ref) => {
    
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

const Highlight=  React.forwardRef<HTMLDivElement, HighlightProps>(
    ({content, segments, onSegmentClick, onSelect}, ref) => {

    const nsegments: [number, number, Color, number] = segments.map(([start, end, color], index) => [start, end, color, index])

    function blend(background : Color, foreground: Color, opacity: number){
      background.red = background.red * (1 - opacity) + foreground.red * opacity
      background.green = background.green * (1 - opacity) + foreground.green * opacity
      background.blue = background.blue * (1 - opacity) + foreground.blue * opacity
    }
    function combineColors(mset: Map<string, number>) : Color {
        let out: Color = {red: 255, green: 255, blue: 255}
        let count = 0
        const opacity = .3
        for (let scolor of mset.keys()) {
          let color:Color = JSON.parse(scolor)
          let weight:number = mset.get(scolor)

          if (weight == 0)
            continue
          count += 1

          for (let i = 0; i < weight; i++){
            blend(out, color, opacity)
          }
        }
        if (mset.size == 0 || count == 0)
            return {red: 255, green: 255, blue:255}
        return out
    }

    let iterate: Array<[number, Color, Boolean, number]> = [];
    for (let i of nsegments) {
      iterate.push([i[0], i[2], true, i[3]]);
      iterate.push([i[1] + 1, i[2], false, i[3]]);
    }

    iterate.sort((a, b) => a[0] - b[0]);

    let mapIterate : Map<number, {colors:Color[], isStart:Boolean[], segIndex:number[]}> = new Map();
    let iterateIndex: number[] = [];

    for(let i of iterate){
        if (mapIterate.has(i[0])){
          let newColors = mapIterate.get(i[0]).colors;
          newColors.push(i[1]);

          let newIsStart = mapIterate.get(i[0]).isStart;
          newIsStart.push(i[2]);

          let newSegIndex = mapIterate.get(i[0]).segIndex;
          newSegIndex.push(i[3])
          mapIterate.set(i[0], {
            colors: newColors,
            isStart: newIsStart,
            segIndex: newSegIndex
          });
        }else{
          iterateIndex.push(i[0]);
          mapIterate.set(i[0], {
            colors: [i[1]],
            isStart: [i[2]],
            segIndex: [i[3]]
          });
        }
    }

    let res: [number, number, Color, number | null][] = [];
    let currentColorMultiSet: Map<string, number> = new Map();
    let currentSegIndexSet: Set<number> = new Set();
    let prevIndex = 0;


    for (let i of iterateIndex){
      let curr = mapIterate.get(i);
      res.push([prevIndex, i - 1, combineColors(currentColorMultiSet), currentSegIndexSet.values().next().value]);
      prevIndex = i;
      for(let j = 0;j < curr.isStart.length;j++){
        if(!curr.isStart[j]){
          currentColorMultiSet.set(JSON.stringify(curr.colors[j]), (currentColorMultiSet.get(JSON.stringify(curr.colors[j])) || 0) - 1);
          currentSegIndexSet.delete(curr.segIndex[j]);
        }
      }

      for(let j = 0;j < curr.isStart.length;j++){
          if(curr.isStart[j]){
            currentColorMultiSet.set(JSON.stringify(curr.colors[j]), (currentColorMultiSet.get(JSON.stringify(curr.colors[j])) || 0) + 1);
            currentSegIndexSet.add(curr.segIndex[j]);
          }
      }
    }

    if (prevIndex <= content.length - 1)
        res.push([prevIndex, content.length - 1, combineColors(currentColorMultiSet), currentSegIndexSet.values().next().value]);

    return <HighlightDisjoint content={content} segments={res} onSegmentClick={(index) => onSegmentClick(res[index][3])} onSelect={onSelect} ref={ref}/>

})

export default Highlight;