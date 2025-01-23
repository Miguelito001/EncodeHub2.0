document.addEventListener('DOMContentLoaded', function () {
    // Função para calcular carga horária
    const calculateWorkHours = (section) => {
        const entrada = section.querySelector('#entrada').value;
        const saidaAlmoco = section.querySelector('#saida-almoco').value;
        const retornoAlmoco = section.querySelector('#retorno-almoco').value;
        const saidaFinal = section.querySelector('#saida-final').value;
        const output = section.querySelector('.large-area--output');

        if (!entrada || !saidaAlmoco || !retornoAlmoco) {
            output.value = 'Por favor, preencha pelo menos os horários de entrada, saída para almoço e retorno do almoço.';
            return;
        }

        const toMinutes = (time) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const entradaMin = toMinutes(entrada);
        const saidaAlmocoMin = toMinutes(saidaAlmoco);
        const retornoAlmocoMin = toMinutes(retornoAlmoco);
        const saidaFinalMin = saidaFinal ? toMinutes(saidaFinal) : null;

        const horasTrabalhadas = (saidaAlmocoMin - entradaMin) + (saidaFinalMin ? (saidaFinalMin - retornoAlmocoMin) : 0);
        const minutosFaltantes = (8 * 60) - horasTrabalhadas;

        if (!saidaFinalMin) {
            // Calcula o horário necessário para completar 8 horas
            const trabalhoManha = saidaAlmocoMin - entradaMin;
            const trabalhoTarde = 8 * 60 - trabalhoManha; // Completa 8h no total
            const horarioSaidaNecessario = retornoAlmocoMin + trabalhoTarde;

            const horasSaida = Math.floor(horarioSaidaNecessario / 60);
            const minutosSaida = horarioSaidaNecessario % 60;

            output.value = `Para completar 8 horas, o horário de saída deve ser: ${horasSaida.toString().padStart(2, '0')}:${minutosSaida.toString().padStart(2, '0')}.`;
        } else {
            // Exibe o total de horas trabalhadas e verifica se excedeu ou faltou tempo
            const horas = Math.floor(horasTrabalhadas / 60);
            const minutos = horasTrabalhadas % 60;

            if (minutosFaltantes > 0) {
                const faltamHoras = Math.floor(minutosFaltantes / 60);
                const faltamMinutos = minutosFaltantes % 60;
                output.value = `Total: ${horas} horas e ${minutos} minutos. Faltam ${faltamHoras} horas e ${faltamMinutos} minutos para completar 8 horas.`;
            } else {
                const excedenteMinutos = Math.abs(minutosFaltantes);
                const excedenteHoras = Math.floor(excedenteMinutos / 60);
                const excedenteRestante = excedenteMinutos % 60;
                output.value = `Total: ${horas} horas e ${minutos} minutos. Excedeu ${excedenteHoras} horas e ${excedenteRestante} minutos das 8 horas.`;
            }
        }
    };

    const calculateFinalDate = (section) => {
    const dataInicialInput = section.querySelector('#data-inicial').value;
    const horasInput = section.querySelector('#horas').value;
    const output = section.querySelector('.large-area--output');

    if (!dataInicialInput || !horasInput || horasInput <= 0) {
        output.value = 'Por favor, preencha a data inicial e a quantidade de horas corretamente.';
        return;
    }

    const feriadosGenericos = ['01-01', '04-21', '05-01', '09-07', '12-25'];

    try {
        let data = new Date(dataInicialInput);
        let horasRestantes = parseInt(horasInput, 10);

        // Configuração do horário de trabalho
        const horarioManhaInicio = 8 * 60; // 8:00 em minutos
        const horarioManhaFim = 12 * 60; // 12:00 em minutos
        const horarioTardeInicio = 13 * 60 + 12; // 13:12 em minutos
        const horarioTardeFim = 18 * 60; // 18:00 em minutos
        const horasPorDia = (horarioManhaFim - horarioManhaInicio) + (horarioTardeFim - horarioTardeInicio); // Total de horas úteis por dia

        // Garante que a data inicial nunca esteja no passado
        const hoje = new Date();
        if (data < hoje) {
            data = hoje;
        }

        // Verificação de horas no dia inicial
        const calculaHorasDisponiveisHoje = () => {
            const minutosAgora = data.getHours() * 60 + data.getMinutes();
            let minutosDisponiveis = 0;

            if (minutosAgora < horarioManhaInicio) {
                minutosDisponiveis = horasPorDia;
            } else if (minutosAgora < horarioManhaFim) {
                minutosDisponiveis = (horarioManhaFim - minutosAgora) + (horarioTardeFim - horarioTardeInicio);
            } else if (minutosAgora < horarioTardeInicio) {
                minutosDisponiveis = horarioTardeFim - horarioTardeInicio;
            } else if (minutosAgora < horarioTardeFim) {
                minutosDisponiveis = horarioTardeFim - minutosAgora;
            }

            return minutosDisponiveis;
        };

        // Ajusta as horas do primeiro dia
        let minutosRestantes = horasRestantes * 60;
        let minutosDisponiveisHoje = calculaHorasDisponiveisHoje();
        minutosRestantes -= minutosDisponiveisHoje;

        if (minutosRestantes <= 0) {
            const dataFinal = new Date(data);
            const horaFinal = horarioTardeFim - Math.abs(minutosRestantes);
            const horasSaida = Math.floor(horaFinal / 60);
            const minutosSaida = horaFinal % 60;

            output.value = `Data Final: ${dataFinal.toLocaleDateString('pt-BR')}, às ${horasSaida.toString().padStart(2, '0')}:${minutosSaida.toString().padStart(2, '0')}`;
            return;
        }

        // Ajusta os dias seguintes
        while (minutosRestantes > 0) {
            data.setDate(data.getDate() + 1);

            const diaSemana = data.getDay();
            const mesDia = data.toISOString().slice(5, 10);

            if (diaSemana !== 0 && diaSemana !== 6 && !feriadosGenericos.includes(mesDia)) {
                const minutosDia = Math.min(horasPorDia, minutosRestantes);
                minutosRestantes -= minutosDia;
            }
        }

        output.value = `Data Final: ${data.toLocaleDateString('pt-BR')}`;
    } catch {
        output.value = 'Erro ao calcular a data. Verifique os valores inseridos.';
    }
};


    // Adicionando os eventos para cada seção
    document.querySelectorAll('.converter-section').forEach((section) => {
        const type = section.getAttribute('data-type');
        const button = section.querySelector('.controls__button--generate');

        button.addEventListener('click', () => {
            if (type === 'time-calculator') {
                calculateWorkHours(section);
            } else if (type === 'date-calculator') {
                calculateFinalDate(section);
            }
        });
    });
});
