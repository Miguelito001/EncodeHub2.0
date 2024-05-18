// Cria um nome único para o localStorage
var uniqueLocalStorageName = 'binario_inputText';

document.addEventListener('DOMContentLoaded', function() {
    var inputTextArea = document.querySelector('.large-area--input');
    var outputTextArea = document.querySelector('.large-area--output');
    var formatButton = document.querySelector('.controls__button--format');
    var menorButton = document.querySelector('.controls__button--menor');

    // Carrega o texto salvo do localStorage quando a página é carregada
    if (localStorage.getItem(uniqueLocalStorageName)) {
        inputTextArea.value = localStorage.getItem(uniqueLocalStorageName);
    }

    formatButton.addEventListener('click', function() {
        var inputText = inputTextArea.value;
        var binaryText = textToBinary(inputText);
        outputTextArea.value = binaryText;
        // Salva o texto no localStorage
        localStorage.setItem(uniqueLocalStorageName, inputText);
    });

    menorButton.addEventListener('click', function() {
        var inputText = inputTextArea.value;
        if (isValidBinary(inputText)) {
            var normalText = binaryToText(inputText);
            outputTextArea.value = normalText;
            // Salva o texto no localStorage
            localStorage.setItem(uniqueLocalStorageName, normalText);
        } else {
            alert('Entrada inválida! Certifique-se de que a entrada é um binário válido.');
        }
    });

    // Salva o texto no localStorage sempre que ele é modificado
    inputTextArea.addEventListener('input', function() {
        localStorage.setItem(uniqueLocalStorageName, inputTextArea.value);
    });

    function isValidBinary(binary) {
        return /^[01]*$/.test(binary) && binary.length % 8 === 0;
    }

    function textToBinary(text) {
        var binary = '';
        for (var i = 0; i < text.length; i++) {
            var binChar = text.charCodeAt(i).toString(2);
            binary += '0'.repeat(8 - binChar.length) + binChar;
        }
        return binary;
    }

    function binaryToText(binary) {
        var text = '';
        for (var i = 0; i < binary.length; i += 8) {
            var chunk = binary.substr(i, 8);
            text += String.fromCharCode(parseInt(chunk, 2));
        }
        return text;
    }
});
