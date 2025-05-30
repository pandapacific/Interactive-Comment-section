import newData from "../script/data.js";
import data from "../script/data.js"; //Import the data module for the comments

// Identify the comments section
const commentSection = document.getElementById("commentSection");
function createClone(x) {
    const clone = document.querySelector("#template").content.cloneNode(true).querySelector(".toBeCloned"); //clone the template
    const userImage = clone.querySelector(".comment").querySelector(".comment-meta").querySelector("img");
    const userName = clone.querySelector(".comment").querySelector(".comment-meta").querySelector(".username");
    const timeStamp = clone.querySelector(".comment").querySelector(".comment-meta").querySelector(".createdAt");
    const commentText = clone.querySelector(".comment").querySelector(".comment-body");
    const vote = clone.querySelector(".comment").querySelector(".comment-footer").querySelector(".comment-vote").querySelector(".voteText");

    // Update the values
    userImage.src = x.user.image.png;
    userName.textContent = x.user.username;
    timeStamp.textContent = formatTimeAgo(x.createdAt);
    timeStamp.setAttribute("data-time", x.createdAt)
    commentText.textContent = x.content;
    vote.textContent = x.score;
    clone.querySelector(".comment").id = x.id; //update id

    // return clone;
    return clone;
}
// load comments and replies
function loadComments(createdClone, x) {
    // append created comment
    commentSection.append(createdClone);

    // append created replies
    if (x.replies && x.replies.length > 0) {
        let replyClone;
        const replySection = createdClone.querySelector(".reply");
        replySection.classList.remove("hidden");
        replySection.classList.add("flex")
        x.replies.forEach(reply => {
            replyClone = createClone(reply);
            replySection.append(replyClone);
        })
    }
}

// iterate over each of the comments and render
newData.comments.forEach(x => {
    const storedUserComments = JSON.parse(localStorage.getItem("userComments")) || [];

    storedUserComments.forEach(comment => {
        loadComments(createClone(comment), comment);
    });

    // append clone format
    loadComments(createClone(x), x);


})

// vote functionality
const commentContainer = document.getElementById("commentSection"); //locate overall comment container for event delegation
let hasVotedUp = false; // check if the user has voted up
let hasVotedDown = false; // check if the user has voted down
let hasVoted = false; // check if the user has voted
commentContainer.addEventListener("click", (e) => {
    // locate the buttons
    const plusVote = e.target.closest(".votePlus");
    const minusVote = e.target.closest(".voteMinus");
    let voteCount;

    // prevent negative votes
    function resetNegative(voteCount, vote) {
        if (voteCount < 0) {
            voteCount = 0; //reset voteCount
            vote.textContent = voteCount;
            return voteCount;
        } else { return voteCount }
    }
    function checkVoteReset() {
        if (voteCount === 0) {
            hasVotedUp = false;
            hasVotedDown = false;
            hasVoted = false;
        }
    }
    // logic
    if (plusVote) {
        const vote = plusVote.parentElement.querySelector(".voteText");
        voteCount = parseInt(vote.textContent); // get the vote count
        if (hasVotedDown) {
            voteCount++;
            vote.textContent = voteCount;
            hasVotedDown = false;
            hasVoted = false;
            checkVoteReset();
        } else if (!hasVotedUp) {
            voteCount++;
            vote.textContent = voteCount;
            hasVotedUp = true;
            hasVoted = true;
            checkVoteReset();
        }
    }
    if (minusVote) {
        const vote = minusVote.parentElement.querySelector(".voteText"); //get the parent element of vote button
        voteCount = parseInt(vote.textContent); // get the vote count
        if (hasVotedUp) {
            voteCount--;
            vote.textContent = voteCount;
            hasVotedUp = false;
            hasVoted = false;
            checkVoteReset();
        } else if (!hasVotedDown) {
            voteCount--;
            voteCount = resetNegative(voteCount, vote); //reset negative
            vote.textContent = voteCount;
            hasVotedDown = true;
            hasVoted = true;
            checkVoteReset();
        }
    }
})

// send comment functionality
const mainCommentForm = document.getElementById("commentForm"); //locate main comment form
const mainSendBtns = mainCommentForm.querySelectorAll(".send"); //locate both send buttons
//send comment logic
mainSendBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const mainText = mainCommentForm.querySelector(".textBox").value; // locate textarea input
        // comment object
        const userObj = {
            id: Math.floor((Math.random()) * 10000),
            content: mainText,
            createdAt: new Date().toISOString(),
            score: 0,
            user: {
                image: {
                    png: "./images/avatars/image-juliusomo.png",
                    webp: "./images/avatars/image-juliusomo.webp"
                },
                username: "juliusomo"
            },
            replies: []
        }
        // saving to local storage
        const savedComments = JSON.parse(localStorage.getItem("userComments") || []);
        savedComments.push(userObj);//add comment
        localStorage.setItem("userComments", JSON.stringify(savedComments));

        // create and append the comment
        loadComments(createClone(userObj), userObj);
        console.log(createClone(userObj));

        // clear textArea
        mainCommentForm.querySelector(".textBox").value = "";

    })
})

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
    const timeElements = document.querySelectorAll(".createdAt");
    timeElements.forEach(el => {
        const isoTime = el.dataset.time;
        const newText = formatTimeAgo(isoTime);
        el.innerHTML = newText;
    });
}

// update every 30 seconds
setInterval(updateTimestamps, 30000);

// local storage