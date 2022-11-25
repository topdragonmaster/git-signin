import React, { useState } from "react";
import { IPost, IPostClient } from "src/types";
import Button from "src/components/Button";

import "./index.scss";

interface IPostItem {
  post: IPost;
  isLogin: boolean;
  onEdit: ({ id, context, poster, isPrivate }: IPostClient) => void;
  onDelete: (id: string | undefined) => void;
}

const PostItem = ({
  post,
  isLogin,
  onEdit,
  onDelete,
}: IPostItem) => {
  const {_id, poster, context, isPrivate} = post
  const [editable, setEditable] = useState(false);
  const [editedData, setEditedData] = useState({
    _id,
    context: context,
    poster: poster && poster._id,
    isPrivate: isPrivate,
  });
  const handleEdit = () => {
    setEditable(true);
  };

  const handleSave = () => {
    onEdit(editedData);
    setEditable(false);
  };

  const handleDelete = () => {
    onDelete(_id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setEditedData((prev) => ({ ...prev, context: value }));
  };

  const handleCancleEdit = () => {
    setEditable(false);
  };

  return (
    <div className="post">
      <div className="post_owner">
       <img src={ poster && poster.avatarUrl} alt="github" />
      </div>
      <div className="post_content">
        <div className="post_content__header">
          <span>
            <strong>{ poster && poster.username}</strong>
             {isPrivate? <p className="private">PRIVATE</p>: <p className="public">PUBLIC</p>}
          </span>
          <div className="post_content__header__group">
            {editable ? (
              <>
                <Button type="button" variant="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button type="button" variant="second" onClick={handleCancleEdit}>
                  Cancel
                </Button>
              </>
            ) : (
              isLogin && <>
                <Button type="button" variant="primary" onClick={handleEdit}>
                  Edit
                </Button>
                <Button type="button" variant="second" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            )}
         </div>
        </div> 
        
        <div className="post_content__body">
         {
          editable? <textarea
            rows={5}
            value={editedData.context}
            onChange={handleChange}
          /> : 
          <p>{ context }</p>
         }
        </div> 
      </div>
    </div>
  );
};

export default PostItem;
