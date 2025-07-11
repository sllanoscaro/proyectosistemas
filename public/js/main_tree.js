document.addEventListener('DOMContentLoaded', () => {
    // Selectores para los elementos
    const btnYes = document.getElementById('btnYes');
    const btnNo = document.getElementById('btnNo');
    const creditAmountSlider = document.getElementById('creditAmountSlider');
    const creditAmountValue = document.getElementById('creditAmountValue');
    const jobDurationSlider = document.getElementById('jobDurationSlider');
    const jobDurationValue = document.getElementById('jobDurationValue');
    const incomeSlider = document.getElementById('incomeSlider');
    const incomeValue = document.getElementById('incomeValue');
    const timeLoanSlider = document.getElementById('timeLoanSlider');
    const timeLoanValue = document.getElementById('timeLoanValue');
    const creditRateSlider = document.getElementById('creditRateSlider');
    const creditRateValue = document.getElementById('creditRateValue');
    const submitBtn = document.getElementById('submitBtn');

    const modal = document.getElementById('infoModal');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');

    // Estado inicial de los botones Sí/No
    let hasDebtHistory = true; // Por defecto 'Sí' está activo

    // Función para formatear moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Actualizar el valor inicial de los sliders
    creditAmountValue.textContent = formatCurrency(parseInt(creditAmountSlider.value));
    creditRateValue.textContent = `${parseInt(creditRateSlider.value)}%`;
    incomeValue.textContent = formatCurrency(parseInt(incomeSlider.value));
    updateJobDurationValue(parseInt(jobDurationSlider.value));
    updateTimeLoanValue(parseInt(timeLoanSlider.value));


    // Lógica para los botones Sí/No
    btnYes.addEventListener('click', () => {
        btnYes.classList.add('active');
        btnNo.classList.remove('active');
        hasDebtHistory = true;
    });

    btnNo.addEventListener('click', () => {
        btnNo.classList.add('active');
        btnYes.classList.remove('active');
        hasDebtHistory = false;
    });

    creditAmountSlider.addEventListener('input', () => {
        creditAmountValue.textContent = formatCurrency(parseInt(creditAmountSlider.value));
    });

    creditRateSlider.addEventListener('input', () => {
        creditRateValue.textContent = `${parseInt(creditRateSlider.value)}%`;
    })
    incomeSlider.addEventListener('input', () => {
        incomeValue.textContent = formatCurrency(parseInt(incomeSlider.value));
    });

    jobDurationSlider.addEventListener('input', () => {
        updateJobDurationValue(parseInt(jobDurationSlider.value));
    });

    timeLoanSlider.addEventListener('input', () => {
        updateTimeLoanValue(parseInt(timeLoanSlider.value));
    })


    // Lógica para el slider de Duración en el trabajo actual
    // Función para actualizar el texto de duración (años y meses)
    function updateJobDurationValue(months) {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let text = '';
        if (years > 0) {
            text += `${years} año${years > 1 ? 's' : ''}`;
        }
        if (remainingMonths > 0) {
            if (years > 0) text += ' ';
            text += `${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
        }
        if (years === 0 && remainingMonths === 0) {
            text = '0 meses'; // O el valor mínimo que quieras representar
        }
        jobDurationValue.textContent = text;
    }

    function updateTimeLoanValue(months) {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let text = '';
        if (years > 0) {
            text += `${years} año${years > 1 ? 's' : ''}`;
        }
        if (remainingMonths > 0) {
            if (years > 0) text += ' ';
            text += `${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`;
        }
        if (years === 0 && remainingMonths === 0) {
            text = '0 meses'; // O el valor mínimo que quieras representar
        }
        timeLoanValue.textContent = text;
    }

    function updateSliderBackground(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const val = parseFloat(slider.value);
        const percent = ((val - min) / (max - min)) * 100;

        slider.style.background = `linear-gradient(to right, #2ecc71 0%, #2ecc71 ${percent}%, #d3d3d3 ${percent}%, #d3d3d3 100%)`;
    }


    // Lógica para el botón de enviar
    submitBtn.addEventListener('click', () => {
        const data = {
        historialMorosidad: hasDebtHistory ? 'Sí' : 'No',
        montoCredito: parseInt(creditAmountSlider.value),
        duracionTrabajoMeses: parseInt(jobDurationSlider.value),
        ingresosUltimoMes: parseInt(incomeSlider.value),
        duracionPrestamo: parseInt(timeLoanSlider.value),
        tasaInteres: parseInt(creditRateSlider.value)
    };
        console.log('Datos de entrada:', data);
        evaluateDecisionTree(data);
    });

    // Aplicar color dinámico al cargar
    document.querySelectorAll('.slider').forEach(slider => {
        updateSliderBackground(slider);
        slider.addEventListener('input', () => updateSliderBackground(slider));
    });

    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // También cerrar al hacer clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- Lógica del Árbol de Decisión ---
    function evaluateDecisionTree(data) {
        const timeLoanMonths = data.duracionPrestamo;
        const creditRate = data.tasaInteres / 100;
        const cuotaMensual = data.montoCredito / timeLoanMonths;
        const porcentajeCuota = cuotaMensual / data.ingresosUltimoMes;

        // Check all conditions
        const hasNoDebtHistory = data.historialMorosidad === 'No';
        const hasEnoughJobTime = data.duracionTrabajoMeses >= 24;
        const hasEnoughIncome = porcentajeCuota <= (creditRate);

        const isApproved = hasNoDebtHistory &&
            hasEnoughJobTime &&
            hasEnoughIncome;

        highlightTreePath({ hasNoDebtHistory, hasEnoughJobTime, hasEnoughIncome });

        evaluateCreditResult(isApproved, {
            hasNoDebtHistory,
            hasEnoughJobTime,
            hasEnoughIncome
        });

        return isApproved;
    }

    function evaluateCreditResult(isApproved, conditions) {
        let message = isApproved ?
            "¡Crédito APROBADO!" :
            "Crédito RECHAZADO por las siguientes razones:\n";

        if (!isApproved) {
            if (!conditions.hasNoDebtHistory) {
                message += "- Tiene historial de morosidad\n";
            }
            if (!conditions.hasEnoughJobTime) {
                message += "- Antigüedad laboral insuficiente (mínimo 24 meses)\n";
            }
            if (!conditions.hasEnoughIncome) {
                message += "- Ingresos mensuales insuficientes para la cuota\n";
            }
        }
        console.log(message);
    }

    function highlightTreePath(conditions) {
        // Limpia cualquier resaltado previo
        document.querySelectorAll('.node, .leaf, .reject').forEach(node => node.classList.remove('highlight'));

        if (!conditions.hasNoDebtHistory) {
            document.getElementById('node1').classList.add('highlight');
            document.getElementById('node1r').classList.add('highlight');
            return;
        }

        document.getElementById('node1').classList.add('highlight');
        document.getElementById('node2').classList.add('highlight');

        if (!conditions.hasEnoughJobTime) {
            document.getElementById('node2r').classList.add('highlight');
            return;
        }

        document.getElementById('node3').classList.add('highlight');

        if (!conditions.hasEnoughIncome) {
            document.getElementById('node3r').classList.add('highlight');
            return;
        }

        document.getElementById('node4').classList.add('highlight');
    }

});