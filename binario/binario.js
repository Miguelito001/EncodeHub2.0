var BinaryConverterModule = (function () {
    // Variável privada única para o localStorage
    var uniqueLocalStorageName = 'binario_inputText';

    // Seletores dos elementos DOM
    var inputTextArea = document.querySelector('.large-area--input');
    var outputTextArea = document.querySelector('.large-area--output');
    var formatButton = document.querySelector('.controls__button--format');
    var menorButton = document.querySelector('.controls__button--menor');

    // Função privada para carregar dados do localStorage
    function loadFromLocalStorage() {
        if (localStorage.getItem(uniqueLocalStorageName)) {
            inputTextArea.value = localStorage.getItem(uniqueLocalStorageName);
        }
    }

    // Função privada para validar se a entrada é um binário válido
    function isValidBinary(binary) {
        return /^[01]*$/.test(binary) && binary.length % 8 === 0;
    }

    // Função privada para converter texto em binário
    function textToBinary(text) {
        var binary = '';
        for (var i = 0; i < text.length; i++) {
            var binChar = text.charCodeAt(i).toString(2);
            binary += '0'.repeat(8 - binChar.length) + binChar;
        }
        return binary;
    }

    // Função privada para converter binário em texto
    function binaryToText(binary) {
        var text = '';
        for (var i = 0; i < binary.length; i += 8) {
            var chunk = binary.substr(i, 8);
            text += String.fromCharCode(parseInt(chunk, 2));
        }
        return text;
    }

    // Função privada para configurar os eventos
    function initEventListeners() {
        formatButton.addEventListener('click', function () {
            var inputText = inputTextArea.value;
            var binaryText = textToBinary(inputText);
            outputTextArea.value = binaryText;
            localStorage.setItem(uniqueLocalStorageName, inputText); // Salva o texto no localStorage
        });

        menorButton.addEventListener('click', function () {
            var inputText = inputTextArea.value;
            if (isValidBinary(inputText)) {
                var normalText = binaryToText(inputText);
                outputTextArea.value = normalText;
                localStorage.setItem(uniqueLocalStorageName, normalText); // Salva o texto no localStorage
            } else {
                alert('Entrada inválida! Certifique-se de que a entrada é um binário válido.');
            }
        });

        inputTextArea.addEventListener('input', function () {
            localStorage.setItem(uniqueLocalStorageName, inputTextArea.value);
        });
    }

    // Funções reveladas (públicas)
    return {
        init: function () {
            loadFromLocalStorage();
            initEventListeners();
        }
    };
})();

// Inicializa o módulo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    BinaryConverterModule.init();
});
