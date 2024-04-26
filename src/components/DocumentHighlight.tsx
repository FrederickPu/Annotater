import React, {useEffect, useRef, useState, forwardRef} from 'react'
import Highlight from "./Highlight";
import Comment from "./Comment.tsx"

import './ContextMenu.css';

const ContextMenu = forwardRef(({ xPos, yPos, onComment }, ref) => {
  return (
    <div ref={ref} className="context-menu" style={{ top: yPos, left: xPos }}>
      <button onClick={onComment}>Comment</button>
      <button>Respond</button>
    </div>
  );
})

interface Color {
    red: number;
    green: number;
    blue: number
}

interface MainComment {
  userid: number;
  commentid: number;
  seg: [number, number];
}

interface DocumentHighlightProp {
  content: string;
  comments: Array<MainComment>;
  colorMap: Map<number, Color>;
  onCommentClick: (userid: number, commentid: number) => void
  onComment: (start, end) => void
  onOutsideClick: () => void
}

const DocumentHighlight = ({content, comments, colorMap, onCommentClick, onComment, onOutsideClick} : DocumentHighlightProp) => {
    const [contextMenuPos, setContextMenuPos] = useState({ xPos: 0, yPos: 0 });
    const [isContextMenuVisible, setContextMenuVisible] = useState(false);
  
    const contextMenuRef = useRef(null);
    const highlightRef = useRef(null);

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
  
      if (selection && !highlightRef.current.contains(e.target) && !isContextMenuVisible) {
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
      <div className="document-highlight" onContextMenu={handleContextMenu}>
        {isContextMenuVisible && (
          <ContextMenu
            ref={contextMenuRef}
            xPos={contextMenuPos.xPos}
            yPos={contextMenuPos.yPos}
            onComment={() => {setContextMenuVisible(false); selection && onComment(selection.startPos, selection.endPos)}}
          />
        )}
        <Highlight 
          content={content}
          segments={comments.map(({userid, commentid, seg} : MainComment) => [seg[0], seg[1], colorMap.get(userid)])}
          onSegmentClick={(index) => (index === undefined) ? onOutsideClick() : onCommentClick(comments[index].userid, comments[index].commentid)}
          onSelect={(start, end) => setSelection({startPos:start, endPos:end})}
          ref={highlightRef}
        />
        <h1>{JSON.stringify(selection)}</h1>
      </div>
    );
  };

export default DocumentHighlight