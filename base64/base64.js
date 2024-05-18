// Cria um nome único para o localStorage
var uniqueLocalStorageName = 'base_inputText';

document.addEventListener("DOMContentLoaded", function () {
    const inputTextArea = document.querySelector(".large-area--input");
    const outputTextArea = document.querySelector(".large-area--output");
    const formatToButton = document.querySelector(".controls__button--format");
    const formatFromButton = document.querySelector(".controls__button--menor");
  
    // Carrega o texto salvo do localStorage quando a página é carregada
    if (localStorage.getItem(uniqueLocalStorageName)) {
        inputTextArea.value = localStorage.getItem(uniqueLocalStorageName);
    }

    // Salva o texto no localStorage sempre que ele é modificado
    inputTextArea.addEventListener('input', function() {
        localStorage.setItem(uniqueLocalStorageName, inputTextArea.value);
    });
    formatToButton.addEventListener("click", function () {
        const inputText = inputTextArea.value;
        const base64Text = btoa(inputText); // Convertendo para Base64

        outputTextArea.value = base64Text;
    });

    formatFromButton.addEventListener("click", function () {
        const base64Text = inputTextArea.value;
        try {
            const decodedText = atob(base64Text); // Convertendo de Base64
            outputTextArea.value = decodedText;
        } catch (error) {
            outputTextArea.value = "Erro: entrada inválida em Base64";
        }
    });
  
    // Função para converter a imagem em base64
    function imageToBase64() {
        // Obtém o elemento input file
        var fileInput = document.getElementById('file');

        // Verifica se algum arquivo foi selecionado
        if (fileInput.files.length > 0) {
            // Obtém o arquivo selecionado
            var file = fileInput.files[0];

            // Cria um objeto FileReader
            var reader = new FileReader();

            // Define a função de callback para quando a leitura estiver concluída
            reader.onload = function(event) {
                // Atribui a base64 ao textarea de saída
                var base64String = event.target.result;
                document.querySelector('.large-area--output').value = base64String;
            };

            // Lê o arquivo como uma URL de dados
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione um arquivo de imagem.');
        }
    }

    // Associando a função ao evento change do input file
    document.getElementById('file').addEventListener('change', imageToBase64);
});
