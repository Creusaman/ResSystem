async function calculateAccommodationPrice(userCheckIn, userCheckOut, acomodacaoId, userQuantity) {
    const acomodacao = await fetchAccommodationById(acomodacaoId);
    const rules = await fetchRulesForAccommodation(acomodacaoId);
    const existingReservations = await fetchReservationsForAccommodation(acomodacaoId, userCheckIn, userCheckOut);
    const maxAmount = acomodacao.maxAmount;

    userCheckIn = new Date(userCheckIn);
    userCheckOut = new Date(userCheckOut);

    let reservationDaysArray = [];
    for (let d = new Date(userCheckIn); d < userCheckOut; d.setDate(d.getDate() + 1)) {
        reservationDaysArray.push({
            date: new Date(d),
            totalReservasExistentes: 0,
            regrasAplicaveis: [],
            disponibilidade: maxAmount
        });
    }

    // Step 5: Process each day
    reservationDaysArray.forEach(day => {
        // Step 5a: Locate all reservations for the day and sum quantities
        existingReservations.forEach(reserva => {
            if (reserva.checkIn <= day.date && reserva.checkOut > day.date) {
                day.totalReservasExistentes += reserva.quantidade;
            }
        });

        // Step 5b: Compare total reservations with maxAmount
        if (day.totalReservasExistentes + userQuantity > maxAmount) {
            const vagasDisponiveis = maxAmount - day.totalReservasExistentes;
            if (vagasDisponiveis > 0) {
                throw new Error(`Apenas ${vagasDisponiveis} vagas disponíveis para a data ${day.date.toLocaleDateString()}`);
            }
            throw new Error(`Indisponível para a data ${day.date.toLocaleDateString()}`);
        }

        // Locate and store applicable rules
        rules.forEach(rule => {
            if (rule.checkIn <= day.date && rule.checkOut > day.date) {
                day.regrasAplicaveis.push(rule);
            }
        });
    });

    // Steps 6 and 7: Calculate price and availability for each rule
    let totalPrice = 0;
    reservationDaysArray.forEach(day => {
        day.regrasAplicaveis.forEach(regra => {
            if (regra.pacote === 'pacote') {
                // Find overlapping days between the rule and user's stay
                const startOverlap = new Date(Math.max(new Date(regra.checkIn), userCheckIn));
                const endOverlap = new Date(Math.min(new Date(regra.checkOut), userCheckOut));
                const overlapDays = (endOverlap - startOverlap) / (1000 * 60 * 60 * 24);
    
                if (overlapDays > 0) {
                    let pricePerDay = regra.preço / overlapDays;
                    totalPrice += pricePerDay;
                }
            } else { // 'Diárias'
                totalPrice += regra.preço;
            }
        });
    });

    // Step 8: Final price calculation
    // ... (final price logic based on counter and rules)

    return totalPrice;
}
