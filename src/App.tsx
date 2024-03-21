// import './App.css';
// import PastSelector from './components/NavBar/PastSelector';
// import PageContent from './components/Content/PageContent';
// import CommentSection from './components/Content/CommentSection';
import Highlight,  { Color } from './components/Highlight'
import DocumentHighlight from './components/DocumentHighlight'

// const App = () => {
//   return (
//     <>
//       {/* <PastSelector />
//       <div className='contentContainer'>
//         <PageContent />
//         <CommentSection />
//       </div> */}
//       <Highlight />
//     </>
//   )
// }

// export default App

import React, { useState, useRef, useEffect, forwardRef } from 'react';
import './App.css';

interface MainComment {
  userid: number;
  commentid: number;
  seg: [number, number];
}

interface User {
  userid: number;
  color: Color
}

const App = () => {
  const white = {red:255, green:255, blue:255}
  const yellow = {red:255, green:255, blue:0}
  const green = {red:0, green:255, blue: 0}
  const purple = {red: 128, green: 0, blue: 128}

  const users: Array<User> = [{userid : 1, color:green}, {userid: 2, color:yellow}, {userid: 3, color: purple}]
  const id = 1
  const [comments, setComments] = useState([{"userid":1,"commentid":0,"seg":[15,18]},{"userid":2,"commentid":1,"seg":[10,16]}])
  const [commentsContent, setCommentsContent] = useState([])
  
  const [segments, setSegments] = useState([[10, 16, yellow], [15, 18, green], [14, 21, purple], [16, 44, green]]);
  console.log(segments)

  let colorMap = new Map()
  colorMap.set(1, green)
  colorMap.set(2, yellow)
  colorMap.set(3, purple)

  const [commentContent, setCommentContent] = useState("")

  return (
    <>
    <DocumentHighlight 
      content={"Kevin is very smart because of his dedication to visualizing game theory."} 
      comments={comments}
      colorMap={colorMap}
      onCommentClick={(userid, commentid) => {console.log(`userid:${userid} commentid:${commentid}`); alert("asldaklj")}}
      onComment={(start, end) => {setComments((prev) => [...prev, {userid : 1, commentid : prev.length, seg:[start, end]}])}}
      />
      <h1>{JSON.stringify(comments)}</h1>
      <h1>{JSON.stringify(commentsContent)}</h1>
      <textarea
        value={commentContent}
        onChange={e => setCommentContent(e.target.value)}
    />
    </>
  )
};

export default App;
