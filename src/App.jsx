// import './App.css';
// import PastSelector from './components/NavBar/PastSelector';
// import PageContent from './components/Content/PageContent';
// import CommentSection from './components/Content/CommentSection';
import Highlight from './components/Highlight'
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

const App = () => {
  const white = {red:255, green:255, blue:255}
  const yellow = {red:255, green:255, blue:0}
  const green = {red:0, green:255, blue: 0}
  const purple = {red: 128, green: 0, blue: 128}
  
  const [segments, setSegments] = useState([[10, 16, yellow], [15, 18, green], [14, 21, purple], [16, 44, green]]);
  console.log(segments)

  return (
    <>
    <DocumentHighlight 
      content={"Kevin is very smart because of his dedication to visualizing game theory."} 
      segments={segments}
      onComment={(start, end) => {console.log(start, end); setSegments(prev => [...prev, [start, end, green]])}}
      />
    </>
  )
};

export default App;
