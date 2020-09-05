import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import PostItem from "../posts/PostItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { getPost } from "../../actions/post";
const Post = ({ post: { post, loading }, match, getPost }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);
  return loading || post == null ? (
    <Spinner />
  ) : (
    <>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={match.params.id} />
      {post.comments.length > 0 && (
        <div className="comments">
          {post.comments.map((comment) => (
            <>
              <CommentItem
                key={comment._id}
                postId={post._id}
                comment={comment}
              />
            </>
          ))}{" "}
        </div>
      )}
    </>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
