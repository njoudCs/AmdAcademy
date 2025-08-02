// مثال تحديث dots (3 أجزاء في الدرس)
function updateDots(lessonNum, completedSteps) {
    const dots = document.querySelectorAll(`.lesson[data-lesson="${lessonNum}"] .dot`);
    dots.forEach((dot, i) => {
      if (i < completedSteps) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }
  