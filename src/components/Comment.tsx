import React from "react";

export interface Comment {
    commentid: number;
    userid: number;
    content: string;
    seg: [number, number];
}
interface CommentProps {
    comment: Comment
}
export function CommentElement({comment} : CommentProps){
    return (
    <div>
        <h1>Comment: </h1>
        <p>{comment.commentid}</p>
        <p>{comment.content}</p>
    </div>
    )
}