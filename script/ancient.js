// iterate over the data comments and display them
// data.comments.forEach(x => {
//     // Create first two existing comments
//     function createExistingComment() {
//         const commentSection = document.getElementById("commentSection");
//         // append the created comment
//         commentSection.append(createSection());
//     }
//     // Functionalities
//     // create section function
//     function createSection() {
//         const comment = document.createElement("section");
//         // comment.id = "2";
//         comment.classList.add(
//             'levelOne', 'rounded-lg', 'bg-white', 'p-3', 'flex', 'flex-col', 'gap-y-4', 'px-4', 'py-4', 'text-gray-500', 'caret-transparent'
//         );
//         comment.setAttribute('role', 'comment');

//         //append the section components
//         comment.append(createMeta(), createBody(), createFooter());
//         return comment;
//     }

//     // section component creation functionality
//     // create comment meta function
//     function createMeta() {
//         const meta = document.createElement("div");
//         meta.classList.add('comment-meta', 'flex', 'gap-x-4');

//         //append the meta sub-components
//         meta.append(
//             createUserImage(), createUserName(), createTimeStamp()
//         );
//         return meta;
//     }

//     // create comment body function
//     function createBody() {
//         const body = document.createElement("div");
//         body.textContent = x.content;
//         body.classList.add('comment-body');

//         return body;
//     }

//     // create comment footer function
//     function createFooter() {
//         const footer = document.createElement("div");
//         footer.classList.add(
//             'comment-footer', 'flex', 'justify-between', 't-purple-600', 'font-medium'
//         );
//         // append subcomponents
//         footer.append(createCommentVote(), createReply())
//         return footer;
//     }

//     // section component sub-component creation functionality
//     // meta components
//     function createUserImage() {
//         const userImage = document.createElement("img");

//         //userImage styling
//         userImage.src = x.user.image.png;
//         userImage.alt = "User Profile Image";
//         userImage.classList.add('userImage', 'w-7.5');

//         return userImage;
//     }
//     function createUserName() {
//         const userName = document.createElement("div");
//         // userName styling
//         userName.classList.add('username', 't-grey-800', 'font-medium');
//         userName.textContent = x.user.username;
//         return userName;
//     }
//     function createTimeStamp() {
//         const createdAt = document.createElement("div");
//         // timestamp styling
//         createdAt.classList.add('createdAt', 'text-gray-500');
//         createdAt.textContent = x.createdAt;
//         return createdAt;
//     }
//     // there's no body subcomponents.

//     // footer components
//     function createCommentVote() {
//         const commentVote = document.createElement("div");
//         //styling
//         commentVote.classList.add(
//             'comment-vote', 'flex', 'gap-x-5', 'items-center', 'purple-200', 'justify-between', 'px-3', 'py-2', 'rounded-md'
//         )
//         // append subcomponents
//         commentVote.append(createVotePlus(), createVoteText(), createVoteMinus())
//         return commentVote;
//     }
//     function createReply() {
//         const commentReplyButton = document.createElement("div");
//         // styling
//         commentReplyButton.classList.add(
//             'comment-reply', 'flex', 'gap-x-2', 'items-center', 'hover:cursor-pointer', 'hover:brightness-120', 'active:brightness-200'
//         );
//         // append subcomponents
//         commentReplyButton.append(createReplyIcon(), createReplyText())
//         return commentReplyButton;
//     }

//     // comment vote components
//     function createVotePlus() {
//         const votePlus = document.createElement("button");
//         // styling
//         votePlus.id = "votePlus"
//         votePlus.classList.add(
//             'hover:cursor-pointer', 'w-3', 'aspect-square'
//         );
//         // append subcomponents
//         votePlus.append(createSvgPlus())
//         return votePlus;
//     }
//     function createVoteText() {
//         const voteText = document.createElement("div");
//         voteText.innerHTML = x.score;
//         return voteText;
//     }
//     function createVoteMinus() {
//         const voteMinus = document.createElement("button");
//         // styling
//         voteMinus.id = "voteMinus";
//         voteMinus.classList.add(
//             'hover:cursor-pointer', 'w-3', 'aspect-square'
//         );
//         // append subcomponents
//         voteMinus.append(createSvgMinus())
//         return voteMinus;
//     }
//     // reply vote components
//     function createReplyIcon() {
//         const replyIcon = document.createElement("img");
//         // styling
//         replyIcon.src = "./images/icon-reply.svg";
//         replyIcon.alt = "Reply";
//         replyIcon.classList.add('w-3');
//         return replyIcon;
//     }
//     function createReplyText() {
//         const replyText = document.createElement("span");
//         // styling
//         replyText.textContent = "Reply";
//         return replyText;
//     }

//     // comment vote subcomponents
//     function createSvgPlus() {
//         const svgPlus = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//         svgPlus.setAttribute("width", "11");
//         svgPlus.setAttribute("height", "11");
//         // append
//         svgPlus.append(createPlusPath());
//         return svgPlus;
//     }
//     function createSvgMinus() {
//         const svgMinus = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//         svgMinus.setAttribute("width", "11");
//         svgMinus.setAttribute("height", "3");
//         // append
//         svgMinus.append(createMinusPath());
//         return svgMinus;
//     }
//     function createPlusPath() {
//         const plusPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
//         plusPath.setAttribute(
//             "d",
//             "M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
//         );
//         plusPath.classList.add('fill-[#C5C6EF]', 'svgPlus');
//         return plusPath;
//     }
//     function createMinusPath() {
//         const minusPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
//         minusPath.setAttribute(
//             "d",
//             "M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
//         );
//         minusPath.classList.add("fill-[#C5C6EF]", "svgMinus");
//         return minusPath;
//     }
//     createExistingComment();
// });


