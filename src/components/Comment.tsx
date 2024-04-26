import React from "react";
import './Comment.css'

export interface Comment {
    commentid: number;
    userid: number;
    content: string;
    seg: [number, number];
}

interface Color {
    red: number;
    green:number;
    blue: number
}
interface CommentProps {
    comment: Comment;
    colorMap: Map<number, Color>
}
export function CommentElement({comment, colorMap} : CommentProps){
    return (
        <div className="comment">
            <div className="bar" style={{backgroundColor: `rgb(${colorMap.get(comment.userid).red}, ${colorMap.get(comment.userid).green}, ${colorMap.get(comment.userid).blue})`}}></div>
            <div>
            <h1>User #{comment.userid}</h1>
            <p>Responded to: {JSON.stringify(comment.seg)} with:</p>
            <p className="comment-content">"{comment.content}"</p>
            </div>
        </div>
    )
}