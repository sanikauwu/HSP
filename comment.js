// 确保 Firebase 已初始化（需在页面先加载 firebase-init.js）

// 读取用户昵称（如果没有就用匿名）
const userName = (localStorage.getItem("nickname") || "匿名さん")
  .replace(/[.#$/\[\]]/g, "_"); // Firebase 禁止字符自动替换 "_"

// ---------------------
//  页面ID 安全生成
// ---------------------
let rawFileName = location.pathname.split("/").pop() || "index";

// 替换所有非法字符（点号等）
let pageId = rawFileName.replace(/[.#$/\[\]]/g, "_");

// 去掉扩展名 .html → 页面名
pageId = pageId.replace(/_html$/i, "");

// Firebase 路径
const commentPath = "comments/" + pageId;

// ---------------------
//  评论区 HTML 自动插入
// ---------------------
document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  container.id = "commentSection";
  container.style = `
    margin-top:60px;
    padding:20px;
    background:#ffffffcc;
    border-radius:16px;
    box-shadow:0 4px 20px rgba(0,0,0,0.08);
    width:90%;
    max-width:650px;
    margin-left:auto;
    margin-right:auto;
    backdrop-filter:blur(6px);
  `;

  container.innerHTML = `
    <h3 style="margin-top:0; color:#FA7DAD; font-size:1.3em;">💬 コメント</h3>

    <!-- 输入框永远在最上面 -->
    <textarea id="commentInput" placeholder="コメントを書く..." 
      style="width:100%; height:80px; padding:12px; font-size:1em;
      border:1px solid #e5c8c5; border-radius:10px; outline:none; resize:none;
      background:#FFF9F9;"></textarea>

    <button id="sendCommentBtn"
      style="margin-top:10px; padding:10px 25px; background:#FA7DAD; border:none;
      color:white; border-radius:20px; cursor:pointer; box-shadow:0 3px 10px rgba(250, 125, 173, 0.3);">
      送信する
    </button>

    <!-- 评论列表永远在下面，最新在最上面 -->
    <div id="commentList" style="margin-top:20px;"></div>
  `;

  document.body.appendChild(container);

  const commentList = document.getElementById("commentList");
  const commentInput = document.getElementById("commentInput");
  const sendBtn = document.getElementById("sendCommentBtn");

  // ---------------------
  //  实时读取：最新评论在最上面
  // ---------------------
  db.ref(commentPath)
    .orderByChild("time")
    .on("child_added", snapshot => {
      const val = snapshot.val();

      const div = document.createElement("div");
      div.style = `
        padding:12px 14px;
        margin-bottom:12px;
        background:#FFF5F7;
        border-radius:10px;
        border:1px solid #F8D7E0;
        font-size:0.95em;
        line-height:1.5em;
      `;

      div.innerHTML = `
        <strong style="color:#FA7DAD;">${val.user}</strong><br>
        ${val.text}
      `;

      commentList.prepend(div); // 🌟 新评论永远在最上方
    });

  // ---------------------
  //  发送评论（使用 push）
  // ---------------------
  sendBtn.onclick = () => {
    const text = commentInput.value.trim();
    if (!text) return;

    db.ref(commentPath).push({
      user: userName,
      text: text,
      time: Date.now()
    });

    commentInput.value = "";
  };
});
