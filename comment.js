// ===== 获取昵称 =====
window.userName = window.userName || localStorage.getItem("nickname") || "匿名さん";

// ===== 安全的页面ID（去掉 .html）=====
let pageId = location.pathname.split("/").pop() || "index";
pageId = pageId.replace(".html", "");

// Firebase 路径
const commentPath = "comments/" + pageId;

// ===== 创建评论区 DOM（整体包裹）=====
function createCommentSection() {
  const wrapper = document.createElement("div");
  wrapper.id = "commentWrapper";

  wrapper.innerHTML = `
    <!-- 评论输入区（透明，不在白框里） -->
    <div id="commentInputArea">
      <h3>💬 コメント</h3>
      <textarea id="commentInput" placeholder="コメントを書く..."></textarea>
      <button id="sendCommentBtn">送信する</button>
    </div>

    <!-- 评论显示区（白色背景） -->
    <div id="commentList"></div>
  `;

  document.body.appendChild(wrapper);
}

// ===== 初始化评论功能 =====
function initComments() {
  createCommentSection();

  const commentList = document.getElementById("commentList");
  const commentInput = document.getElementById("commentInput");
  const sendBtn = document.getElementById("sendCommentBtn");

  // 🌱 实时监听（新评论在最上面）
  db.ref(commentPath)
    .limitToLast(50)
    .on("child_added", snapshot => {
      const val = snapshot.val();
      if (!val) return;

      const div = document.createElement("div");
      div.className = "commentItem";

      div.innerHTML = `
        <div class="commentUser">${val.user}</div>
        <div class="commentText">${val.text}</div>
      `;

      // 最新的放最上面
      commentList.prepend(div);
    });

  // 📤 发送评论
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
}

// 页面加载完成后执行
window.addEventListener("DOMContentLoaded", initComments);
