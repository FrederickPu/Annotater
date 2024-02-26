import React from 'react';


interface AppState {
  content: string,
  segments: [[number, number, string]] // disjoint segments (start, end, color)
}

function Highlight() {

  // const contextMenuRef = React.useRef(null);
  const [contextMenu, setContextMenu] = React.useState({
    position: {
      x: 0,
      y: 0
    },
    toggled: false
  });

  const state = {
    content: "Kevin is very smart because of his dedication to visualizing game theory.",
    segments: [[10, 12, 'yellow'], [15, 18, 'red']],
  }

  // onMouseDown = (e: React.MouseEvent) => {

  // }

  // onMouseUp = (e: React.MouseEvent) => {
  //   let selectionEvent = window.getSelection();
  //   //console.log(selectionEvent)
  //   let startPos = 0
  //   let endPos = 0
  //   if (selectionEvent.anchorNode.parentElement.id != '')
  //     startPos = state.segments[parseInt(selectionEvent.anchorNode.parentElement.id)][0] + selectionEvent.anchorOffset
  //   else
  //     startPos = selectionEvent.anchorOffset
  //   if (selectionEvent.focusNode.parentElement.id != '')
  //     endPos = state.segments[parseInt(selectionEvent.focusNode.parentElement.id)][0] + selectionEvent.focusOffset
  //   else
  //     endPos = selectionEvent.focusOffset
  //   console.log(startPos, endPos)
  // }
  // {this.state.content.slice(0, this.state.segments[0][0])}
  // {this.state.content.slice(this.state.segments[-1][1])}
  //         {/* I love <mark id={'0'}>Ryan</mark> because he's is <mark id={'1'}>bulgarian split</mark> squat. */}
  return (
    <>
      <div
        onMouseUp={(e: React.MouseEvent) => {
          let selectionEvent = window.getSelection();
          //console.log(selectionEvent)
          let startPos = 0
          let endPos = 0
          if (selectionEvent.anchorNode.parentElement.id != '')
            startPos = state.segments[parseInt(selectionEvent.anchorNode.parentElement.id)][0] + selectionEvent.anchorOffset
          else
            startPos = selectionEvent.anchorOffset
          if (selectionEvent.focusNode.parentElement.id != '')
            endPos = state.segments[parseInt(selectionEvent.focusNode.parentElement.id)][0] + selectionEvent.focusOffset
          else
            endPos = selectionEvent.focusOffset
          console.log(startPos, endPos)
        }}
        onContextMenu={(e) => {
          e.preventDefault();

          const contextMenuAttr = contextMenuRef.current?.getBoundingClientRect()
          console.log(contextMenuRef)

          const isLeft = e.clientX < window?.innerWidth / 2

          let x
          let y = e.clientY

          if (isLeft) {
            x = e.clientX
          } else {
            x = e.clientX - contextMenuAttr.width
          }

          setContextMenu({
            position: {
              x: x,
              y: y
            },
            toggled: true
          })

        }}
      >
        {state.content.slice(0, state.segments[0][0])}
        {
          state.segments.map((segment, i) => (
            <React.Fragment key={i}>
              <mark key={i} id={i} style={{ backgroundColor: segment[2] }} onClick={() => console.log(segment[2])}>{state.content.slice(segment[0], segment[1] + 1)}</mark>
              {i + 1 < state.segments.length &&
                state.content.slice(segment[1] + 1, state.segments[i + 1][0])}
            </React.Fragment>
          ))
        }
        {state.content.slice(state.segments[state.segments.length - 1][1] + 1, state.content.length)}
      </div>
      <h1>asd</h1>
    </>
  )
}

export default Highlight;