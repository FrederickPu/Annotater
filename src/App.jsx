// import './App.css';
// import PastSelector from './components/NavBar/PastSelector';
// import PageContent from './components/Content/PageContent';
// import CommentSection from './components/Content/CommentSection';
import Highlight from './components/Highlight'

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
import './ContextMenu.css';

const ContextMenu = forwardRef(({ xPos, yPos, onComment }, ref) => {
  return (
    <div ref={ref} className="context-menu" style={{ top: yPos, left: xPos }}>
      <button onClick={onComment}>Comment</button>
      <button>Respond</button>
    </div>
  );
});

const App = () => {
  const [contextMenuPos, setContextMenuPos] = useState({ xPos: 0, yPos: 0 });
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);

  const contextMenuRef = useRef(null);
  const highlightRef = useRef(null);

  const white = {red:255, green:255, blue:255}
  const yellow = {red:255, green:255, blue:0}
  const green = {red:0, green:255, blue: 0}
  const purple = {red: 128, green: 0, blue: 128}


  const [segments, setSegments] = useState([[10, 16, yellow], [15, 18, green], [14, 21, purple]]);
  const [selection, setSelection] = useState(null)

  const handleContextMenu = (e) => {
    e.preventDefault();
    const clickX = e.clientX;
    const clickY = e.clientY;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const menuW = 200; // Set your menu width here
    const menuH = 150; // Set your menu height here

    const posX = clickX < screenW - menuW ? clickX : screenW - menuW;
    const posY = clickY < screenH - menuH ? clickY : screenH - menuH;

    setContextMenuPos({ xPos: posX, yPos: posY });
    setContextMenuVisible(true);
  };

  const handleOutsideClick = (e) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target) && isContextMenuVisible) {
      setContextMenuVisible(false);
    }

    if (selection && !highlightRef.current.contains(e.target)) {
      setSelection(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isContextMenuVisible, selection]);


  return (
    <div className="app" onContextMenu={handleContextMenu}>
      {isContextMenuVisible && (
        <ContextMenu
          ref={contextMenuRef}
          xPos={contextMenuPos.xPos}
          yPos={contextMenuPos.yPos}
          onComment={() => selection && setSegments(prev => [...prev, [selection.startPos, selection.endPos, green]])}
        />
      )}
      {/* [...prev, [selection.startPos, selection.endPos, "green"]] */}
      <Highlight 
        content={"Kevin is very smart because of his dedication to visualizing game theory."}
        segments={segments}
        onSelect={(start, end) => setSelection({startPos:start, endPos:end})}
        ref={highlightRef}
      />
      <h1>{JSON.stringify(selection)}</h1>
    </div>
  );
};

export default App;

