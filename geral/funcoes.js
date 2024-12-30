document.addEventListener("DOMContentLoaded", function () {
  const outputContainer = document.querySelector(".large-area--output-container");
  const outputArea = document.querySelector(".large-area--output");
  const toggleExpandBtn = document.getElementById("toggle-expand-btn");
  let isExpanded = false;

  // Função para alternar expansão
  toggleExpandBtn.addEventListener("click", function () {
      if (!isExpanded) {
          outputContainer.classList.add("expanded");
          outputArea.classList.add("expanded");
          isExpanded = true;
          toggleExpandBtn.textContent = "❌"; // Alterar o ícone para indicar "Reduzir"
      } else {
          outputContainer.classList.remove("expanded");
          outputArea.classList.remove("expanded");
          isExpanded = false;
          toggleExpandBtn.textContent = "🔳"; // Alterar o ícone para indicar "Expandir"
      }
  });
});
