import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import { Modal, Table, message } from "antd";  
import { FaHome, FaSearch, FaVideo, FaHeart, FaUserFriends, FaShare, FaPlusCircle, FaEllipsisV } from "react-icons/fa";
import showConfirm from "./confirm";
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';


function Dashboard() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [newPost, setNewPost] = useState({ img: "", caption: "" });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUserData, setEditingUserData] = useState({ username: '', fullname: '' });
  const [viewingUser, setViewingUser] = useState(null);
  const navigate = useNavigate();
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const payload = parseJwt(token);
        setUser(payload);
      } catch (error) {
        console.error("Error parsing token", error);
        navigate("/login");
      }
    }
    loadPosts();
    loadAllUsers();
  }, [navigate]);

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };
  
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const payload = parseJwt(token);
      if (payload.exp * 1000 < Date.now()) {
        console.error("Token has expired!");
        navigate("/login");
        return;
      }

      const response = await axios.get("https://backend-n41a.onrender.com/api/accounts", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && Array.isArray(response.data.users)) {
        setAllUsers(response.data.users);
      } else {
        console.error("Unexpected response format or empty data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response ? error.response.data : error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadPosts = () => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    if (savedPosts.length === 0) {
      const mockPosts = [
        { id: uuidv4(), username: "john_doe", img: "https://media.tenor.com/DM7SdBiQKhEAAAAM/cat-underwater.gif", likes: 0, caption: "Underwater Cat", comments: [] },
        { id: uuidv4(), username: "mary_jane", img: "https://handluggageonly.co.uk/wp-content/uploads/2023/10/Best-Things-To-Do-In-Paris-France-7.jpg", likes: 0, caption: "Beautiful Paris", comments: [] },
      ];
      setPosts(mockPosts);
      localStorage.setItem("posts", JSON.stringify(mockPosts));
    } else {
      setPosts(savedPosts);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCreatePost = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    if (!editingPostId) {
      setNewPost({ img: "", caption: "" });
    }
    setEditingPostId(null);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (editingPostId) {
      const updatedPosts = posts.map((post) =>
        post.id === editingPostId ? { ...post, ...newPost } : post
      );
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      setEditingPostId(null);
    } else {
      const newPostData = { id: uuidv4(), username: user.username, ...newPost, likes: 0 };
      const updatedPosts = [...posts, newPostData];
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
    }
    handleModalCancel();
  };

  const handleEditPost = (post) => {
    setNewPost({ img: post.img, caption: post.caption });
    setEditingPostId(post.id);
    setIsModalVisible(true);
  };

  const handleDeletePost = (id) => {
    showConfirm(
      "Are you sure you want to delete this post?",
      () => {
        const updatedPosts = posts.filter((post) => post.id !== id);
        setPosts(updatedPosts);
        localStorage.setItem("posts", JSON.stringify(updatedPosts));
      },
      () => {
        console.log("Delete canceled");
      }
    );
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + (post.likes ? -1 : 1) } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const handleShare = (postId) => {
    alert(`Post ${postId} shared!`);
  };

  const handleAddStory = () => {
    const newStory = {
      username: user?.username || "anonymous",
      avatar: "https://via.placeholder.com/100",
    };
    setStories([...stories, newStory]);
  };

  const handleShowAccount = () => {
    loadAllUsers();
    setIsAccountVisible(true);
  };

  const handleAccountCancel = () => {
    setIsAccountVisible(false);
    setEditingUserId(null);
    setEditingUserData({ username: '', fullname: '' });
    setViewingUser(null);
  };

  const handleEditUser = (user) => {
    setEditingUserId(user.id);
    setEditingUserData({ username: user.username, fullname: user.fullname });
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
  };

  const handleDeleteUser = (userId) => {
    showConfirm(
      "Are you sure you want to delete this user?",
      async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`https://backend-n41a.onrender.com/api/accounts/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          message.success(`User ${userId} deleted successfully!`);
          loadAllUsers();
        } catch (error) {
          console.error("Error deleting user:", error.response ? error.response.data : error.message);
          message.error("Error deleting user. Please try again.");
        }
      },
      () => {
        console.log("Delete canceled");
      }
    );
  };
  
  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const updatedUser = {
        username: editingUserData.username,
        fullname: editingUserData.fullname,
    };

    // Reset the form
    const resetForm = () => {
        setEditingUserId(null);
        setEditingUserData({ username: '', fullname: '' });
    };

    if (editingUserId) {
        try {
            const response = await axios.put(
                `https://backend-n41a.onrender.com/api/accounts/${editingUserId}`,
                updatedUser,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Response from server:", response.data);

            if (response.status === 200) {
                // Ensure a simple message call
                message.success("User information updated successfully!");
                resetForm();
                loadAllUsers();

                // Optional: Refresh the page
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                message.error("Failed to update user information.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            message.error("Error updating user. Please try again.");
        } finally {
            resetForm();
        }
    }
};


  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#">InstaCam</Navbar.Brand>
          <div className="d-flex">
            <Button variant="outline-secondary" className="me-2" onClick={handleShowAccount}>
              Account
            </Button>
            <Button onClick={handleLogout} variant="outline-danger">
              Logout
            </Button>
          </div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <div className="sidebar">
          <button><FaHome /> Home</button>
          <button><FaSearch /> Search</button>
          <button><FaVideo /> Reels</button>
          <button><FaUserFriends /> Messages</button>
          <button onClick={handleCreatePost}><FaPlusCircle /> Create</button>
        </div>

        {/* Center Feed */}
        <div className="feed">
          {/* Stories Section */}
          <div className="stories">
            <Button variant="outline-primary" onClick={handleAddStory} className="add-story-btn">
              + Add Story
            </Button>
            {stories.map((story, index) => (
              <div key={index} className="story">
                <img src={story.avatar} alt={story.username} className="story-img" />
                <span>{story.username}</span>
              </div>
            ))}
          </div>

          {/* Posts Section */}
          {posts.map((post) => (
            <Card className="mb-3" key={post.id}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <strong>@{post.username}</strong>
                <Dropdown>
                  <Dropdown.Toggle variant="link" id="dropdown-menu-button" className="text-dark">
                    <FaEllipsisV />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditPost(post)}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeletePost(post.id)} className="text-danger">
                      Delete
                    </Dropdown.Item>
                    <Dropdown.Item>Add to Favorites</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleShare(post.id)}>Share</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Cancel</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Header>
              <Card.Img variant="top" src={post.img} alt="Post" />
              <Card.Body>
                <div className="post-actions">
                  <Button variant="outline-danger" onClick={() => handleLike(post.id)} className="me-2">
                    <FaHeart /> {post.likes === 0 ? "Like" : "Unlike"}
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleShare(post.id)}>
                    <FaShare /> Share
                  </Button>
                </div>
                <p>{post.caption}</p>
                <Form
                  className="mt-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const comment = e.target.elements.comment.value;
                    setPosts(posts.map((p) =>
                      p.id === post.id
                        ? { ...p, comments: [...(p.comments || []), comment] }
                        : p
                    ));
                    e.target.reset();
                  }}
                >
                  <Form.Control
                    type="text"
                    name="comment"
                    placeholder="Add a comment..."
                    className="rounded-pill"
                  />
                </Form>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal for Creating/Editing Post */}
      <Modal title={editingPostId ? "Edit Post" : "Create Post"} open={isModalVisible} onCancel={handleModalCancel} footer={null}>
        <Form onSubmit={handlePostSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control type="text" value={newPost.img} onChange={(e) => setNewPost({ ...newPost, img: e.target.value })} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Caption</Form.Label>
            <Form.Control as="textarea" value={newPost.caption} onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingPostId ? "Save Changes" : "Create Post"}
          </Button>
        </Form>
      </Modal>

      {/* Modal for Account/User Details */}
      <Modal title="Account Details" open={isAccountVisible} onCancel={handleAccountCancel} footer={null}>
        <Form onSubmit={handleAccountSubmit}>
          {editingUserId && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingUserData.fullname}
                  onChange={(e) => setEditingUserData({ ...editingUserData, fullname: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={editingUserData.username}
                  onChange={(e) => setEditingUserData({ ...editingUserData, username: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </>
          )}
        </Form>

        <Table
          loading={loadingUsers}
          dataSource={allUsers.map(user => ({
            key: user.id,
            ...user,
          }))}
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
            },
            {
              title: "Full Name",
              dataIndex: "fullname",
              key: "fullname",
            },
            {
              title: "Username",
              dataIndex: "username",
              key: "username",
            },
            {
              title: "Actions",
              render: (text, record) => (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <Button
                    onClick={() => handleViewUser(record)}
                    className="btn btn-info"
                    style={{ backgroundColor: '#17a2b8', color: 'white', border: 'none' }}
                  >
                    Read
                  </Button>
                  <Button
                    onClick={() => handleEditUser(record)}
                    className="btn btn-warning"
                    style={{ backgroundColor: '#ffc107', color: 'black', border: 'none' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(record.id)}
                    className="btn btn-danger"
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none' }}
                  >
                    Delete
                  </Button>
                </div>
              ),
            },
          ]}
          pagination={false}
        />
      </Modal>

      {/* Modal for Viewing User Information */}
      <Modal title="User Information" open={viewingUser !== null} onCancel={() => setViewingUser(null)} footer={null}>
        {viewingUser && (
          <div>
            <p><strong>ID:</strong> {viewingUser.id}</p>
            <p><strong>Full Name:</strong> {viewingUser.fullname}</p>
            <p><strong>Username:</strong> {viewingUser.username}</p>
          </div>
        )}
      </Modal>
    </>
  );
}

export default Dashboard;

