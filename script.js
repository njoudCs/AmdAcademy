document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".loginBtn");
  const userNameDisplay = document.getElementById("userNameDisplay");
  const investBtn = document.getElementById("investBtn");
  const showPopup = localStorage.getItem("showPopup");
  const modal = document.getElementById("welcomeModal");
  const welcomeUser = document.getElementById("welcomeUser");
  const video = document.getElementById("welcomeVideo");
  const startBtn = document.getElementById("startBtn");
  const startvideo = document.getElementById("startvideo");

  // ---------------- index.html ----------------
  if (loginBtn) {
    const savedUser = localStorage.getItem("activeUser");

    if (savedUser) {
      loginBtn.style.display = "none";
      userNameDisplay.style.display = "inline";
      userNameDisplay.textContent = `مرحبًا، ${savedUser}`;
    }


    loginBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });


    if (investBtn) {
      investBtn.addEventListener("click", () => {
        if (!savedUser) {
          alert("الرجاء تسجيل الدخول أولاً");
          return;
        }
        window.location.href = "investmenttype.html";
      });
    }

 

    // ✅ البوب-أب يظهر مرة وحدة فقط بعد تسجيل الدخول
if (showPopup === "true" && savedUser && modal) {
  welcomeUser.textContent = `أهلاً وسهلاً ${savedUser} 🌟`;
  modal.style.display = "flex";
  video.play();

  // نحذفه فوراً عشان ما يشتغل بالمرة الجاية
 // نحذف الفلاج مباشرة بعد العرض
 setTimeout(() => {
  localStorage.removeItem("showPopup");
}, 0);
}

if (startBtn) {
  startBtn.addEventListener("click", () => {

    modal.style.display = "none";
    // نتأكد أنه ما يرجع يشتغل
    localStorage.setItem("showPopup", "shown");
  });
}

if (startvideo) {
  startvideo.addEventListener("click", () => {
    video.muted = false;
    video.play();
   // modal.style.display = "none";
    // نتأكد أنه ما يرجع يشتغل
   // localStorage.setItem("showPopup", "shown");
  });
}

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    localStorage.setItem("showPopup", "shown");
  });
}

  }

  // ---------------- login.html ----------------
  const saveUserBtn = document.getElementById("saveUserBtn");
  if (saveUserBtn) {
    const userNameInput = document.getElementById("userNameInput");
    const usersGrid = document.getElementById("usersGrid");
    const errorMsg = document.getElementById("errorMsg");
    const avatars = ["noura.svg", "sara.svg", "noura.svg", "noura.svg"];
    const gradients = [
      "linear-gradient(180deg, #EF8B60, #100014)",
      "linear-gradient(180deg, #8B8AD9, #100014)",
      "linear-gradient(180deg, #B9B8D7, #185A9D)",
      "linear-gradient(180deg, #F7971E, #100014)"
    ];

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    function renderUsers() {
      usersGrid.innerHTML = "";
      users.forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";
        card.style.background = user.bg;

        const img = document.createElement("img");
        img.src = user.avatar;
        img.alt = "Avatar";

        const name = document.createElement("span");
        name.textContent = user.name;

        card.appendChild(img);
        card.appendChild(name);

        card.addEventListener("click", () => {
          localStorage.setItem("activeUser", user.name);
          localStorage.setItem("showPopup", "true"); // هنا فقط يطلع البوب أب
          window.location.href = "index.html";
        });
        

        usersGrid.appendChild(card);
      });
    }

   // renderUsers();

    saveUserBtn.addEventListener("click", () => {
      const newUser = userNameInput.value.trim();
      errorMsg.style.display = "none";
    
      if (!newUser) {
        errorMsg.textContent = "الرجاء إدخال الاسم";
        errorMsg.style.display = "block";
        return;
      }
    
      if (users.length >= 4) {
        errorMsg.textContent = "لا يمكنك إنشاء أكثر من 4 حسابات 👥";
        errorMsg.style.display = "block";
        return;
      }
    
      const randomAvatar = "images/" + avatars[Math.floor(Math.random() * avatars.length)];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    
      users.push({ name: newUser, avatar: randomAvatar, bg: randomGradient });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("activeUser", newUser);
    
      // فقط نرندر الكروت بدون ريداركت
      renderUsers();
      userNameInput.value = "";
    });
    
  }
});
localStorage.clear();
