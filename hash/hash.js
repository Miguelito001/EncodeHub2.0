document.addEventListener('DOMContentLoaded', function () {
    const HashGeneratorModule = (function () {
        const selectors = {
            inputArea: document.querySelector('.large-area--input'),
            outputArea: document.querySelector('.large-area--output'),
            algorithmSelect: document.querySelector('#input-format'),
            generateButton: document.querySelector('#generate-hash')
        };

        async function generateHash() {
            const algorithm = selectors.algorithmSelect.value;
            const inputText = selectors.inputArea.value.trim();

            try {
                if (!inputText) {
                    selectors.outputArea.value = '';
                    return;
                }

                const hash = await calculateHash(algorithm, inputText);
                selectors.outputArea.value = hash;
            } catch (error) {
                selectors.outputArea.value = 'Erro: ' + error.message;
            }
        }

        async function calculateHash(algorithm, inputText) {
            const encoder = new TextEncoder();
            const data = encoder.encode(inputText);

            if (crypto.subtle) {
                const hashBuffer = await crypto.subtle.digest(algorithm, data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
            } else {
                throw new Error('Seu navegador não suporta a API Web Crypto.');
            }
        }

        function initEventListeners() {
            selectors.generateButton.addEventListener('click', generateHash);
        }

        return {
            init: function () {
                initEventListeners();
            }
        };
    })();

    HashGeneratorModule.init();
});
