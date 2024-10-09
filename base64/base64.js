var Base64ConverterModule = (function () {
    // Nome único para o localStorage
    var uniqueLocalStorageName = 'base_inputText';

    // Seletores dos elementos DOM
    const inputTextArea = document.querySelector(".large-area--input");
    const outputTextArea = document.querySelector(".large-area--output");
    const formatToButton = document.querySelector(".controls__button--format");
    const formatFromButton = document.querySelector(".controls__button--menor");
    const fileInput = document.getElementById('file');

    // Função privada para carregar dados do localStorage
    function loadFromLocalStorage() {
        if (localStorage.getItem(uniqueLocalStorageName)) {
            inputTextArea.value = localStorage.getItem(uniqueLocalStorageName);
        }
    }

    // Função privada para salvar no localStorage quando o texto é modificado
    function saveToLocalStorage() {
        inputTextArea.addEventListener('input', function () {
            localStorage.setItem(uniqueLocalStorageName, inputTextArea.value);
        });
    }

    // Função para converter texto para Base64
    function convertTextToBase64() {
        formatToButton.addEventListener("click", function () {
            const inputText = inputTextArea.value;
            const base64Text = btoa(inputText); // Convertendo para Base64
            outputTextArea.value = base64Text;
        });
    }

    // Função para converter Base64 para texto
    function convertBase64ToText() {
        formatFromButton.addEventListener("click", function () {
            const base64Text = inputTextArea.value;
            try {
                const decodedText = atob(base64Text); // Convertendo de Base64
                outputTextArea.value = decodedText;
            } catch (error) {
                outputTextArea.value = "Erro: entrada inválida em Base64";
            }
        });
    }

    // Função para converter uma imagem para Base64
    function imageToBase64() {
        if (fileInput.files.length > 0) {
            var file = fileInput.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                var base64String = event.target.result;
                outputTextArea.value = base64String;
            };

            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione um arquivo de imagem.');
        }
    }

    // Função para associar eventos ao input de arquivo
    function bindImageToBase64Conversion() {
        fileInput.addEventListener('change', imageToBase64);
    }

    // Função para inicializar os eventos e carregar dados
    function init() {
        loadFromLocalStorage();
        saveToLocalStorage();
        convertTextToBase64();
        convertBase64ToText();
        bindImageToBase64Conversion();
    }

    // Revelando apenas a função init para inicializar o módulo
    return {
        init: init
    };

})();

// Inicializa o módulo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    Base64ConverterModule.init();
});
