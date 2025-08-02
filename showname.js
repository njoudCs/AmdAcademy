document.addEventListener("DOMContentLoaded", () => {
    const userNameDisplay = document.getElementById("userNameDisplay");
    const investBtn = document.getElementById("investBtn");
  
    // التحقق من المستخدم
    const savedUser = localStorage.getItem("activeUser");
    if (savedUser) {
      userNameDisplay.style.display = "inline";
      userNameDisplay.textContent = `مرحبًا، ${savedUser}`;
    } else {
      // لو ما فيه مستخدم يرجع لصفحة تسجيل الدخول
      window.location.href = "login.html";
    }
  
    // زر الاستثمار
    if (investBtn) {
      investBtn.addEventListener("click", () => {
        window.location.href = "lessons.html"; // غيريها للصفحة التالية
      });
    }
  });
  