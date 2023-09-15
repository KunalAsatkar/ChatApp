import React, { useContext, useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Sidebar() {
    const navigate = useNavigate();
    // const dispatch = useDispatch();
    // const refresh = useSelector((state) => state.refreshKey);
    const { refresh, setRefresh } = useContext(myContext);
    console.log("Context API : refresh : ", refresh);
    const [conversations, setConversations] = useState([]);
    // console.log("Conversations of Sidebar : ", conversations);
    const userData = JSON.parse(localStorage.getItem("userData"));
    // console.log("Data from LocalStorage : ", userData);
    const nav = useNavigate();
    if (!userData) {
        console.log("User not Authenticated");
        nav("/");
    }

    const user = userData.data;
    useEffect(() => {
        // console.log("Sidebar : ", user.token);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios.get("http://localhost:5000/chat/", config).then((response) => {
            console.log("Data refresh in sidebar ", response.data);
            setConversations(response.data);
            // setRefresh(!refresh);
        });
    }, [refresh]);

    return (
        <div className="sidebar-container">
            <div className="sb-header" >
                <div className="other-icons">
                    <IconButton
                        onClick={() => {
                            nav("/app/welcome");
                        }}
                    >
                        <AccountCircleIcon
                            className="icon"
                        />
                    </IconButton>

                    <IconButton
                        onClick={() => {
                            navigate("users");
                        }}
                    >
                        <PersonAddIcon className="icon" />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            navigate("groups");
                        }}
                    >
                        <GroupAddIcon className="icon" />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            navigate("create-groups");
                        }}
                    >
                        <AddCircleIcon className="icon" />
                    </IconButton>

                    <IconButton
                    // onClick={() => {
                    //     dispatch(toggleTheme());
                    // }}
                    >
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            localStorage.removeItem("userData");
                            navigate("/");
                        }}
                    >
                        <ExitToAppIcon className="icon" />
                    </IconButton>
                </div>
            </div>
            <div className="sb-search" >
                <IconButton className="icon">
                    <SearchIcon />
                </IconButton>
                <input
                    placeholder="Search"
                    className="search-box"
                />
            </div>
            <div className="sb-conversations" >
                {conversations.map((conversation, index) => {
                    // console.log("current convo : ", conversation);
                    if (conversation.users.length === 1) {
                        return <div key={index}></div>;
                    }
                    if (conversation.latestMessage === undefined) {
                        // console.log("No Latest Message with ", conversation.users[1]);
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    console.log("Refresh fired from sidebar");
                                    // dispatch(refreshSidebarFun());
                                    setRefresh(!refresh);
                                }}
                            >
                                <div
                                    key={index}
                                    className="conversation-container"
                                    onClick={() => {
                                        navigate(
                                            "chat/" +
                                            conversation._id +
                                            "&" +
                                            conversation.users[1].name
                                        );
                                    }}
                                // dispatch change to refresh so as to update chatArea
                                >
                                    <p className="con-icon" >
                                        {conversation.users[1].name[0]}
                                    </p>
                                    <p className="con-title" >
                                        {conversation.users[1].name}
                                    </p>

                                    <p className="con-lastMessage">
                                        No previous Messages, click here to start a new chat
                                    </p>
                                    {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> */}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={index}
                                className="conversation-container"
                                onClick={() => {
                                    navigate(
                                        "chat/" +
                                        conversation._id +
                                        "&" +
                                        conversation.users[1].name
                                    );
                                }}
                            >
                                <p className="con-icon" >
                                    {conversation.users[1].name[0]}
                                </p>
                                <p className="con-title" >
                                    {conversation.users[1].name}
                                </p>

                                <p className="con-lastMessage">
                                    {conversation.latestMessage.content}
                                </p>
                                {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> */}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
}

export default Sidebar;