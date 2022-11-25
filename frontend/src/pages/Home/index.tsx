import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';

import {
  deletePost,
  editPost,
  getAllPosts,
  addNewPost,
} from "src/Api";

import { CLIENT_ID } from "src/constants/constants";
import { IAuth, IPost, IPostClient, IUserInfo } from "src/types";

import "./index.scss";
import PostItem from "src/components/PostItem";
import Button from "src/components/Button";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";

const Home: React.FC = () => {
  const [userInfo, setUSerInfo] = useState<IUserInfo>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [post, setPost] = useState({
    poster: "",
    context: "",
    isPrivate: true,
  });

  const [cookies, removeCookie] = useCookies();
  const navigate = useNavigate();

  const getUserInfo = () => {
    const auth = cookies.AuthCookie;
    if (auth) {
      const decodedAuthInfo: IAuth = jwt_decode(auth);
      const { id, login, username, avatarUrl, url } = decodedAuthInfo;
      setUSerInfo({
        _id: id,
        username,
        login,
        url,
        avatarUrl,
      });

      setPost((prev) => ({ ...prev,  }));
    }
  };

  useEffect(() => {
    getUserInfo();
    (async () => {
      const data = await getAllPosts();
      setPosts(data);
    })();
  }, []);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const handleLogout = () => {
    removeCookie("AuthCookie", "");
    setUSerInfo({url:"", username: "", login: "", avatarUrl: "" });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (post.context) {
      const res = await addNewPost(post, cookies.AuthCookie);
      if (res) {
        const data = await getAllPosts();
        toast.success('Successfully Added !', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setPosts(data);
        setPost((prev) => ({ ...prev, post: "" }));
      }
    }
  };

  const handlePost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setPost((prev) => ({ ...prev, isPrivate: checked }));
  };

  const handleEdit = async (data: IPostClient) => {
    const res = await editPost(data, cookies.AuthCookie);
    if (res) {
      toast.success('Successfully Edited !', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      const data = await getAllPosts();
      setPosts(data);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (id) {
      const res = await deletePost(id, cookies.AuthCookie);
      if (res) {
        toast.success('Successfully Deleted !', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        const data = await getAllPosts();
        setPosts(data);
      }
    }
  };

  return (
    <div className="container">
      <header className="container__header">
        {userInfo?.username ? (
          <div className="userInfo" onClick={handleToggle}>
            <p>{userInfo.username}</p>
            <img src={userInfo.avatarUrl} alt="github" />
            {toggle && (
              <div className="userInfo__modal">
                <div onClick={() => navigate(`/${userInfo.username}`)}>
                  <p>Profile Page</p>
                </div>
                <input type="button" value="Logout" onClick={handleLogout} />
              </div>
            )}
          </div>
        ) : (
          <a
            href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${CLIENT_ID}`}
            className="signIn"
          >
            Sign In with Github
          </a>
        )}
      </header>
      <section className="posts">
        <div className="posts__container">
          {
          posts.length ? (
            <React.Fragment>
              {posts.map((post) => (
                <PostItem
                  key={post._id}
                  post={post}
                  isLogin={userInfo?._id ? true : false}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </React.Fragment>
          ) : (
            <div className="posts__noposts">No Public Posts</div>
          )}
        </div>
        {userInfo?._id && <div className="create--post">
          <div className="create--post_owner">
            <img src={ userInfo?.avatarUrl} alt="github" />
          </div>
          <form onSubmit={handleSubmit} className="create--post_form">
            <textarea
              name="context"
              onChange={handlePost}
              className="content"
              placeholder="Here is post!"
              value={post.context}
              rows={8}
            />
            <div className="create--post_form__bottom">
              <div className="checkbox">
                <label>Private</label>
                <input
                  type="checkbox"
                  name="isPublic"
                  onChange={handleChecked}
                  checked={post.isPrivate}
                />
              </div>
              <Button type="submit" variant="primary" disabled={userInfo?.username ? false : true}>
                Create New
              </Button>
            </div>
          </form>
        </div>}
        <ToastContainer />
      </section>
    </div>
  );
};

export default Home;
