document.addEventListener("DOMContentLoaded", function() {
    const outputArea = document.querySelector(".large-area--output");
    let isExpanded = false;
  
    outputArea.addEventListener("dblclick", function() {
      if (!isExpanded) {
        outputArea.classList.add('expanded');
        isExpanded = true;
      } else {
        outputArea.classList.remove('expanded');
        isExpanded = false;
      }
    });
  });