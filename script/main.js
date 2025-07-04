import data from "../script/data.js"; //Import the data module for the comments

document.addEventListener("DOMContentLoaded", () => {
    // store data comments and replies in local storage
    const savedComments = JSON.parse(localStorage.getItem("commentList") || "[]");
    if (savedComments.length > 2) {
        //do nothing
    } else if (savedComments.length == 0) {
        data.comments.forEach(x => {
            savedComments.push(x);//add comment
            localStorage.setItem("commentList", JSON.stringify(savedComments));
        })
    }
    const commentSection = document.getElementById("commentSection");
    const main = document.querySelector("main");

    function createClone(x, tempId) {
        const clone = document.querySelector(`#${tempId}`).content.cloneNode(true).querySelector(".toBeCloned"); //clone the template
        const userImage = clone.querySelector(".comment").querySelector(".comment-meta").querySelector("img");
        const userName = clone.querySelector(".comment").querySelector(".comment-meta").querySelector(".username");
        const timeStamp = clone.querySelector(".comment").querySelector(".comment-meta").querySelector(".createdAt");
        const commentText = clone.querySelector(".comment").querySelector(".comment-body");
        const votes = clone.querySelector(".comment").getElementsByClassName("voteText");
        // Update the values
        userImage.src = x.user.image.png;
        userName.textContent = x.user.username;
        // set data attributes for time and edited status
        x.editedAt
            ? (
                timeStamp.textContent = `Edited ${formatTimeAgo(x.editedAt)}`,
                timeStamp.setAttribute("data-time", x.editedAt),
                timeStamp.dataset.isedited = true // set edited status
            )
            : (
                timeStamp.textContent = formatTimeAgo(x.createdAt),
                timeStamp.setAttribute("data-time", x.createdAt)
            )
        // create reply prefix for reply mentions
        if ((x.replyingTo && x.replyingTo !== "") || (x.editingTo && x.editingTo !== "")) {
            const mentionSpan = document.createElement("span");
            mentionSpan.classList.add("t-purple-600", "font-medium");
            mentionSpan.textContent = "@" + (`${x.replyingTo}` || `${x.editingTo}`); // first word, like "@amyrobson"
            const restText = document.createTextNode(" " + x.content);
            commentText.innerHTML = ""; // clear old text
            commentText.appendChild(mentionSpan);
            commentText.appendChild(restText);
        } else {
            commentText.textContent = x.content;
        }
        // set the vote count for both mobile and desktop votes
        Array.from(votes).forEach(vote => {
            vote.textContent = x.score;
        });
        clone.querySelector(".comment").id = x.id; //update id

        // add required metadata
        if (x.source && x.source == "user") {
            clone.dataset.source = x.source;
        } else if (x.type && x.type == "dataReply") {
            clone.dataset.type = x.type;
        }

        const voteContainer = clone.querySelector(".comment-vote"); // or whatever targets the container
        voteContainer.dataset.votedUp = "false";
        voteContainer.dataset.votedDown = "false";

        // return clone;
        return clone;
    }
    function cloneForm() {
        const replyClone = document.querySelector("#replyForm").content.cloneNode(true).querySelector(".replyForm"); //clone the template
        return replyClone;
    }
    function loadComments(x, tempId, section) {
        // append created comment
        const clone = createClone(x, tempId);
        section.append(clone);

        // append created replies
        if (x.replies && x.replies.length > 0) {
            const replySection = clone.querySelector(".reply");
            replySection.classList.remove("hidden");
            replySection.classList.add("flex");

            x.replies.forEach(reply => {
                const tempId = reply.source === "user" ? "userComment" : "dataComment";

                const replyClone = createClone(reply, tempId);
                replySection.append(replyClone);

                if (reply.replies && reply.replies.length > 0) //render replies to data replies
                {
                    reply.replies.forEach(replyToReply => {
                        const tempId = replyToReply.source === "user" ? "userComment" : "dataComment";
                        const replySection = replyClone.querySelector(".reply");

                        replySection.classList.remove("hidden", "md:ml-8", "border-s-[1.5px]", "border-gray-200", "pl-4");
                        replySection.classList.add("flex");

                        const replyToReplyClone = createClone(replyToReply, tempId);
                        replySection.append(replyToReplyClone);
                    })

                }
            })
        }
    }


    //render stored stored comments based on their source
    savedComments.forEach(x => {
        const tempId = x.source === "user" ? "userComment" : "dataComment";
        loadComments(x, tempId, commentSection);
    })

    // vote functionality
    commentSection.addEventListener("click", (e) => {
        // locate the buttons
        const plusVote = e.target.closest(".votePlus");
        const minusVote = e.target.closest(".voteMinus");
        if (!plusVote && !minusVote) return;

        const voteContainer = (plusVote || minusVote).parentElement;
        const voteText = voteContainer.querySelector(".voteText");
        let voteCount = parseInt(voteText.textContent);

        // use dataset to track vote state on the voteContainer
        const state = {
            up: voteContainer.dataset.votedUp === "true",
            down: voteContainer.dataset.votedDown === "true"
        };

        // logic
        if (plusVote) {
            if (state.down) {
                voteCount += 1;
                voteContainer.dataset.votedDown = "false";
                // checkVoteReset();
            } else if (!state.up) {
                voteCount += 1;
                voteContainer.dataset.votedUp = "true";
                // checkVoteReset();
            } else {
                // user unvotes
                voteCount -= 1;
                voteContainer.dataset.votedUp = "false";
            }
        }
        if (minusVote) {
            if (state.up) {
                voteCount -= 1;
                voteContainer.dataset.votedUp = "false";
            } else if (!state.down && voteCount > 0) {
                voteCount -= 1;
                voteContainer.dataset.votedDown = "true";
            } else if (voteCount > 0) {
                // user unvotes
                voteCount += 1;
                voteContainer.dataset.votedDown = "false";
            }
        }
        voteCount = Math.max(0, voteCount); // prevent negatives
        voteText.textContent = voteCount;
    })

    // send comment/reply/edit functionality
    main.addEventListener("click", (e) => {
        const mainForm = e.target.closest("#commentForm"); // main comment form
        const replybtn = e.target.closest(".comment-reply") //reply comment btn
        const editbtn = e.target.closest(".edit") //edit user comment form
        const delbtn = e.target.closest(".delete") //edit user comment form

        if (mainForm) {
            // add form submission on enter key
            mainForm.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // prevent default enter key behavior
                    sendComment(mainForm, "userComment", "regular", commentSection, null);
                }
            })
            const mainFormBtns = mainForm.querySelectorAll(".send"); //locate both send buttons
            mainFormBtns.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    sendComment(mainForm, "userComment", "regular", commentSection, null);
                })
            })
        }
        if (replybtn) {
            //allow only one reply form at a time
            const existingForms = document.querySelectorAll(".replyForm", ".editForm");
            existingForms.forEach(form => {
                form.remove();
            })

            // add the reply form
            const replyForm = cloneForm();
            const comRep = replybtn.parentElement.parentElement.parentElement.parentElement; // get the comment/reply/edit parent
            comRep.append(replyForm); //create a reply form
            replyForm.querySelector(".textBox").focus(); //focus on the form text area
            const repSection = comRep.parentElement.querySelector(".reply");

            // modify the reply section
            if (comRep.parentElement.dataset.type == "dataReply") {
                repSection.classList.remove("hidden", "md:ml-8", "border-s-[1.5px]", "border-gray-200", "pl-4");
                repSection.classList.add("flex");
            } else {
                repSection.classList.remove("hidden");
                repSection.classList.add("flex")
            }

            let initRepLength = repSection.children.length; //get the initial no of replies
            let finRepLength;

            // send the reply
            const replyFormBtns = replyForm.querySelectorAll(".send"); //locate both send buttons
            replyFormBtns.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    const parent = replyForm.parentElement;
                    const repliedId = parent.querySelector(".comment").id;
                    const repliedUser = parent.querySelector(".comment-meta").querySelector(".username").textContent;
                    const repliedInfo = [repliedId, repliedUser]
                    sendComment(replyForm, "userComment", "reply", repSection, repliedInfo);

                    // ensure form is removed after comment has been made
                    finRepLength = repSection.children.length; //get the final no of replies
                    const diff = finRepLength - initRepLength;
                    if (diff == 1) replyForm.remove();
                })
            })
        }
        if (editbtn) {
            // close all edit/reply forms
            const existingReplyForms = document.querySelectorAll(".replyForm");
            const existingEditForms = document.querySelectorAll(".editForm");
            // remove all reply forms
            existingReplyForms.forEach(form => {
                form.remove();
            })
            // hide all edit forms
            existingEditForms.forEach(form => {
                form.classList.remove("flex", "py-4");
                form.classList.add("hidden");
            })

            // reveal the edit form
            const comRep = editbtn.parentElement.parentElement.parentElement.parentElement.parentElement; // get the comment/reply/edit parent 
            // to get the previous text content wether reply or regular comment
            let previousText;
            // check if the parent section is a replySection
            const text = comRep.querySelector(".comment-body").textContent;
            if (comRep.parentElement.parentElement.classList.contains("reply")) {
                previousText = text.split(" ").slice(1).join(" ");
            } else {
                previousText = text;
            }

            const editForm = comRep.querySelector(".editForm");
            editForm.classList.remove("hidden");
            editForm.classList.add("flex", "py-4");
            editForm.querySelector(".textBox").focus();
            editForm.querySelector(".textBox").value = previousText; // set the existing content to the text area

            // send the reply
            const editFormBtns = editForm.querySelectorAll(".send"); //locate both send buttons
            editFormBtns.forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    const parent = editForm.parentElement.parentElement;
                    let repEditedUser
                    if (parent.parentElement.classList.contains("reply")) {
                        repEditedUser = parent.parentElement.parentElement.firstElementChild.querySelector(".username").textContent; // get the user name of the reply
                        const editedId = parent.querySelector(".comment").id;
                        const editedInfo = [editedId, repEditedUser];
                        sendComment(editForm, null, "edit", null, editedInfo);
                    } else {
                        const editedId = parent.querySelector(".comment").id;
                        const editedInfo = [editedId];
                        sendComment(editForm, null, "edit", null, editedInfo);
                    }

                    // remove form after comment has been edited
                    editForm.classList.add("hidden");
                    editForm.classList.remove("flex", "py-4");
                }
            })
        }
        if (delbtn) {
            const parentEl = delbtn.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            const dialogueLayer = document.querySelector(".confirmDel");
            dialogueLayer.classList.remove("hidden");
            dialogueLayer.classList.add("grid");
            confirmDelete(parentEl);
        }
    })

    function findCommentById(commentArray, id) {
        for (const comment of commentArray) {
            if (comment.id == id) {
                return comment;
            } else if (comment.replies && comment.replies.length > 0) {
                const foundInReplies = findCommentById(comment.replies, id);
                if (foundInReplies) {
                    return foundInReplies;
                }
            }
        }
        return null; // explicit fallback
    }

    //send comment logic
    // comment send function
    function sendComment(form, tempId, context, section, info) {
        const mainText = form.querySelector(".textBox").value.trim(); // locate textarea input
        const userObj = {
            id: Math.floor((Math.random()) * 10000000),
            content: mainText,
            createdAt: new Date().toISOString(),
            score: 0,
            source: "user",
            user: {
                image: {
                    png: "./images/avatars/image-juliusomo.png",
                    webp: "./images/avatars/image-juliusomo.webp"
                },
                username: "juliusomo"
            },
            replies: []
        }

        if (mainText && mainText != "") {

            if (context == "regular") {
                savedComments.replies = savedComments.replies || [];
                savedComments.push(userObj);//add comment obj to regular flow
                localStorage.setItem("commentList", JSON.stringify(savedComments));

                // render
                loadComments(userObj, tempId, section);
            } else if (context == "reply") {
                // set the repliedTo in userObj
                userObj.replyingTo = info[1];
                userObj.content = mainText;
                // locate the replied comment via id
                const repliedComment = findCommentById(savedComments, info[0]);

                // save to local storage
                if (repliedComment) {
                    repliedComment.replies = repliedComment.replies || [];
                    repliedComment.replies.push(userObj);
                    localStorage.setItem("commentList", JSON.stringify(savedComments));
                } else {
                    console.warn("No comment found with the given ID!");
                }

                // render
                if (repliedComment) loadComments(userObj, tempId, section);
            } else if (context == "edit") {
                if (info[1] && info[1] !== null) {
                    userObj.editingTo = info[1] // set the user to whom a reply is being edited
                }
                // reassign
                const toEdit = document.getElementById(info[0]).querySelector(".comment-body");
                console.log(toEdit);
                const edit = form.querySelector(".textBox").value;
                const parentComment = toEdit.parentElement.parentElement; // get the parent of the comment body
                const existingTimeStamp = parentComment.querySelector(".createdAt");

                // reassign in localstorage
                const editedComment = findCommentById(savedComments, info[0]);
                if (editedComment) {
                    editedComment.content = edit;
                    editedComment.editedAt = new Date().toISOString();
                    localStorage.setItem("commentList", JSON.stringify(savedComments))
                } else {
                    console.warn("❌ No comment found with the given ID");
                }

                // update the comment body and time stamp render
                if (toEdit)
                    if (info[1] && info[1] !== null) {
                        // if the edited comment is a reply, add the mention prefix
                        const mentionSpan = document.createElement("span");
                        mentionSpan.classList.add("t-purple-600", "font-medium");
                        mentionSpan.textContent = `@${info[1]}`; // first word, like "@amyrobson"
                        const restText = document.createTextNode(" " + edit);
                        toEdit.innerHTML = ""; // clear old text
                        toEdit.appendChild(mentionSpan);
                        toEdit.appendChild(restText);
                    } else {
                        toEdit.textContent = edit; //reassign
                    }

                if (existingTimeStamp) {
                    existingTimeStamp.textContent = `Edited ${formatTimeAgo(editedComment.editedAt)}`; //update time
                    existingTimeStamp.setAttribute("data-time", editedComment.editedAt); //update data-time
                    existingTimeStamp.setAttribute("data-isedited", true); //update data-time
                }

            }

        }

        // clear textArea
        form.querySelector(".textBox").value = "";
    }

    // time calculating function
    function formatTimeAgo(createdAt) {
        const now = new Date();
        const past = new Date(createdAt);
        const seconds = Math.floor((now - past) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(weeks / 4)
        const years = Math.floor(months / 12);

        // logic
        const timeStamp =
            (typeof createdAt === "string" && isNaN(Date.parse(createdAt))) ? createdAt :
                seconds < 60 ? "Just now" :
                    minutes < 60 ? `${minutes} min${minutes > 1 ? "s" : ""} ago` :
                        hours < 24 ? `${hours} hour${hours > 1 ? "s" : ""} ago` :
                            days < 24 ? `${days} day${days > 1 ? "s" : ""} ago` :
                                weeks < 4 ? `${weeks} week${weeks > 1 ? "s" : ""} ago` :
                                    months < 12 ? `${months} month${months > 1 ? "s" : ""} ago` :
                                        `${years} year${years > 1 ? "s" : ""} ago`;
        return timeStamp
    }

    // time updating function
    function updateTimestamps() {
        const timeElements = document.querySelectorAll(".createdAt"); // select all time elements
        timeElements.forEach(el => {
            const isoTime = el.dataset.time;
            const newText = el.dataset.isedited == "true"
                ? `Edited ${formatTimeAgo(isoTime)}` // edited time format
                : formatTimeAgo(isoTime); // regular time ago format 
            el.innerHTML = newText;
        });
    }
    // update every 12 seconds
    setInterval(updateTimestamps, 15000);

    // find parent array and index given id
    function findParentArrayAndIndex(commentArray, id) {
        for (let i = 0; i < commentArray.length; i++) {
            const comment = commentArray[i];
            if (comment.id === id) {
                return { parentArray: commentArray, index: i };
            } else if (comment.replies && comment.replies.length > 0) {
                const found = findParentArrayAndIndex(comment.replies, id);
                if (found) {
                    return found;
                }
            }
        }
        return null; // explicit fallback
    }

    // confirm delete function
    function confirmDelete(comment) {
        const modal = document.querySelector(".confirmDel");
        modal.onclick = function (e) {
            const confirmBtn = e.target.closest(".yesDelete");
            const cancelBtn = e.target.closest(".noDelete");

            if (confirmBtn) {
                const commentId = Number(comment.querySelector(".comment").id);
                const savedComments = JSON.parse(localStorage.getItem("commentList") || "[]");
                // locate the comment index to be deleted and its immediate parent array 
                const result = findParentArrayAndIndex(savedComments, commentId);

                if (result) {
                    const { parentArray, index } = result;
                    parentArray.splice(index, 1); // remove the comment from the parent array
                    localStorage.setItem("commentList", JSON.stringify(savedComments)); // update local storage

                    // remove the comment from the DOM
                    comment.remove();
                } else {
                    console.warn("❌ No comment found with the given ID");
                }

                modal.classList.remove("grid");
                modal.classList.add("hidden");

            }
            if (cancelBtn) {
                modal.classList.remove("grid");
                modal.classList.add("hidden");
            }
        }
    }
})