import React, { useEffect, useMemo, useState } from "react";
import {
  deletePost,
  editPost,
  getAllPosts,
  getUserPosts,
  addNewPost,
} from "../../Api";
import { ToastContainer, toast } from 'react-toastify';

import { CLIENT_ID, USERS } from "../../constants/constants";
import { IAuth, IPost, IPostClient, IUserInfo } from "../../types";

import PostItem from "../../components/PostItem";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
enum FILTER {
  ALL,
  PRIVATE,
  PUBLIC
}

const Profile: React.FC = () => {
  const [userInfo, setUSerInfo] = useState<IUserInfo>();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<IPost[]>([]);
  const [toggle, setToggle] = useState<boolean>(false);
  const [filter, setFilter] = useState<FILTER>(FILTER.ALL);

  const [post, setPost] = useState<IPostClient>({
    poster: "",
    context: "",
    isPrivate: true,
  });


  const [cookies, removeCookie] = useCookies();

  const navigate = useNavigate();
  const param = useParams();
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

      setPost((prev) => ({ ...prev, username }));
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    getUserInfo();
    (async () => {
      if (param.username) {
        setPost({...post, poster: param.username})
        const data = await getUserPosts(param.username, cookies.AuthCookie);
        setPosts(data);
        setFilteredPosts(data)
      }
    })();
  }, [param]);

  const handleToggle = () => {
    setToggle((prev) => !prev);
  };

  const handleLogout = () => {
    removeCookie("AuthCookie", "");
    setUSerInfo({url:"", username: "", login: "", avatarUrl: "" });
    navigate("/");
  };

  const handleEdit = async (data: IPostClient) => {
    const res = await editPost(data, cookies.AuthCookie);
    if (res && post.poster) {
      const data = await getUserPosts(post.poster, cookies.AuthCookie);
      toast.success('Successfully Edited !', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      setPosts(data);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (id) {
      const res = await deletePost(id, cookies.AuthCookie);
      if (res && post.poster) {
        const data = await getUserPosts(post.poster, cookies.AuthCookie);
        toast.success('Successfully Deleted !', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setPosts(data);
      }
    }
  };

  const handleFilterChange = (currentFilter: FILTER) => {
    setFilter(currentFilter)
    switch(currentFilter) {
      case FILTER.ALL : {
        setFilteredPosts(posts)
        break
      } 
      case FILTER.PRIVATE : {
        setFilteredPosts(posts.filter(item => item.isPrivate === true))
        break
      } 
      case FILTER.PUBLIC : {
        setFilteredPosts(posts.filter(item => item.isPrivate !== true))
        break
      } 
      default :{
        setFilteredPosts(posts)
      }
    }
  }

  return (
    <div className="container">
      <header className="container__header">
        {userInfo?.username ? (
          <div className="userInfo" onClick={handleToggle}>
            <p>{userInfo.username}</p>
            <img src={userInfo.avatarUrl} alt="github" />
            {toggle && (
              <div className="userInfo__modal">
                
                <div onClick={() => navigate("/")}>
                  <p>Home Page</p>
                </div>
                <input type="button" value="Logout" onClick={handleLogout} />
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() =>
              window.open(
                `https://github.com/login/oauth/authorize?scope=user:email&client_id=${CLIENT_ID}`,
                "Github Auth",
                `width=${400},height=${600},left=${50},top=${50}`
              )
            }
            className="signIn"
          >
            Sign In with Github
          </button>
        )}
      </header>
      <section className="posts">

        <div className="posts_body">
          <div className="posts_body__tabs">
            <button 
              onClick={() => handleFilterChange(FILTER.ALL)} 
              className={`tab tab__all ${filter === FILTER.ALL? "select": "" }`}
            > 
              All
            </button>
            <button 
              onClick={() => handleFilterChange(FILTER.PUBLIC)} 
              className={`tab tab__all ${filter === FILTER.PUBLIC? "select": "" }`}
            > 
              Public
            </button>
            <button 
              onClick={() => handleFilterChange(FILTER.PRIVATE)} 
              className={`tab tab__all ${filter === FILTER.PRIVATE? "select": "" }`}
            > 
              Private
            </button>
          </div>
          <div className="posts__container">
            {posts.length ? (
              <React.Fragment>
                {filteredPosts.map((post) => (
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
              <div className="posts__noposts">No {userInfo?.username}'s Posts</div>
            )}
          </div>
        </div>
        <ToastContainer />
      </section>
    </div>
  );
};

export default Profile;
