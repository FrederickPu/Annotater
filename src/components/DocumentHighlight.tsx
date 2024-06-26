import React, {useEffect, useRef, useState, forwardRef} from 'react'
import Highlight, { Color } from "./Highlight";
import { HighlightDisjointText } from './HighlightDisjoint.tsx';

import './ContextMenu.css';

const HighlightText = Highlight(HighlightDisjointText)

const ContextMenu = forwardRef(({ xPos, yPos, onComment }, ref) => {
  return (
    <div ref={ref} className="context-menu" style={{ top: yPos, left: xPos }}>
      <button onClick={onComment}>Comment</button>
      <button>Respond</button>
    </div>
  );
})

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
  highlightedIndex: number
}

const DocumentHighlight = ({content, comments, colorMap, onCommentClick, onComment, onOutsideClick, highlightedIndex} : DocumentHighlightProp) => {
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
      // if the mouse clicks outside the context menu, close the context menu
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target) && isContextMenuVisible) {
        setContextMenuVisible(false);
      }

      // if the mouse clicks outside of the selection area reset the selection to null
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
        <HighlightText 
          content={content}
          segments={comments.map(({userid, commentid, seg} : MainComment, index) => [seg[0], seg[1], index === highlightedIndex ? {red : 0 + colorMap.get(userid).red * 2 / 3, green : 0 + colorMap.get(userid).green * 2 / 3, blue: colorMap.get(userid).blue * 2 / 3} : colorMap.get(userid)])}
          onSegmentClick={(index) => (index === undefined) ? onOutsideClick() : onCommentClick(comments[index].userid, comments[index].commentid)}
          onSelect={(start, end) => setSelection({startPos:start, endPos:end})}
          ref={highlightRef}
        />
        <h1>{JSON.stringify(selection)}</h1>
      </div>
    );
  };

export default DocumentHighlight