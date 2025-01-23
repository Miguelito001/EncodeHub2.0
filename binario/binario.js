var BinaryConverterModule = (function () {
    var uniqueLocalStorageName = 'binario_inputText';

    var inputTextArea = document.querySelector('.large-area--input');
    var outputTextArea = document.querySelector('.large-area--output');
    var formatButton = document.querySelector('.controls__button--format');
    var menorButton = document.querySelector('.controls__button--menor');

    function loadFromLocalStorage() {
        if (localStorage.getItem(uniqueLocalStorageName)) {
            inputTextArea.value = localStorage.getItem(uniqueLocalStorageName);
        }
    }

    function isValidBinary(binary) {
        var cleanedBinary = binary.replace(/\s+/g, ''); // Remove todos os espaços
        return /^[01]*$/.test(cleanedBinary) && cleanedBinary.length % 8 === 0;
    }

    function textToBinary(text) {
        var binary = '';
        for (var i = 0; i < text.length; i++) {
            var binChar = text.charCodeAt(i).toString(2);
            binary += '0'.repeat(8 - binChar.length) + binChar + ' ';
        }
        return binary.trim(); // Remove o espaço final extra
    }

    function binaryToText(binary) {
        var cleanedBinary = binary.replace(/\s+/g, ''); // Remove todos os espaços
        var text = '';
        for (var i = 0; i < cleanedBinary.length; i += 8) {
            var chunk = cleanedBinary.substr(i, 8);
            text += String.fromCharCode(parseInt(chunk, 2));
        }
        return text;
    }

    function initEventListeners() {
        formatButton.addEventListener('click', function () {
            var inputText = inputTextArea.value;
            var binaryText = textToBinary(inputText);
            outputTextArea.value = binaryText;
            localStorage.setItem(uniqueLocalStorageName, inputText);
        });

        menorButton.addEventListener('click', function () {
            var inputText = inputTextArea.value;
            if (isValidBinary(inputText)) {
                var normalText = binaryToText(inputText);
                outputTextArea.value = normalText;
                localStorage.setItem(uniqueLocalStorageName, normalText);
            } else {
                alert('Entrada inválida! Certifique-se de que a entrada é um binário válido.');
            }
        });

        inputTextArea.addEventListener('input', function () {
            localStorage.setItem(uniqueLocalStorageName, inputTextArea.value);
        });
    }

    return {
        init: function () {
            loadFromLocalStorage();
            initEventListeners();
        }
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    BinaryConverterModule.init();
});
