import { fetchRulesForAccommodation } from "./firestoreService";

async function calculateAccommodationPrice(userCheckIn, userCheckOut, acomodacaoId, userQuantity) {
  const rules = await fetchRulesForAccommodation(acomodacaoId);

  // Separando as regras por prioridade
  const priority0 = [];
  const priority1 = [];
  const priority2 = [];

  rules.forEach((rule) => {
    if (rule.priority === 0) {
      priority0.push(rule);
    } else if (rule.priority === 1) {
      priority1.push(rule);
    } else {
      priority2.push(rule);
    }
  });

  userCheckIn = new Date(userCheckIn);
  userCheckOut = new Date(userCheckOut);

  let totalPrice = 0;
  let applicableRules = [];
  let availablePackages = [];

  // Criando estrutura para percorrer os dias da reserva
  let reservationDaysArray = [];
  for (let d = new Date(userCheckIn); d < userCheckOut; d.setDate(d.getDate() + 1)) {
    reservationDaysArray.push(new Date(d));
  }

  // Verificando disponibilidade para cada dia
  let unavailableDays = reservationDaysArray.filter((day) => 
    !priority0.some((rule) => rule.checkIn <= day && rule.checkOut > day) &&
    !priority1.some((rule) => rule.checkIn <= day && rule.checkOut > day) &&
    !priority2.some((rule) => rule.checkIn <= day && rule.checkOut > day)
  );

  if (unavailableDays.length > 0) {
    return {
      error: "Não temos disponibilidade para todas as datas selecionadas.",
      unavailableDays: unavailableDays.map(day => day.toLocaleDateString()),
    };
  }

  // Aplicando regras de prioridade
  reservationDaysArray.forEach((day) => {
    let rule = 
      priority0.find((r) => r.checkIn <= day && r.checkOut > day) ||
      priority1.find((r) => r.checkIn <= day && r.checkOut > day) ||
      priority2.find((r) => r.checkIn <= day && r.checkOut > day);

    if (rule) {
      applicableRules.push({ day, rule });
      if (rule.packageType === "pacote") {
        availablePackages.push(rule);
      }
    }
  });

  // Comparação entre pacotes e diárias
  let bestOption = { type: "diária", price: totalPrice };
  let packageSuggestion = null;

  if (availablePackages.length > 0) {
    availablePackages.forEach((pkg) => {
      let packagePrice = pkg.price;
      let daysInPackage = reservationDaysArray.filter(
        (day) => pkg.checkIn <= day && pkg.checkOut > day
      ).length;

      let dailyPrice = applicableRules.reduce((sum, rule) => sum + rule.rule.price, 0);

      if (packagePrice < dailyPrice) {
        bestOption = { type: "pacote", price: packagePrice };
        packageSuggestion = pkg;
      }
    });
  }

  // Consideração da lotação base e pessoas adicionais
  let basePrice = bestOption.price;
  let additionalPeopleCount = Math.max(0, userQuantity - packageSuggestion?.baseOccupancy || 1);
  let additionalPersonCost = additionalPeopleCount * (packageSuggestion?.additionalPersonPrice || 0);
  
  let finalPrice = basePrice + additionalPersonCost;

  // Definir se a sugestão altera o check-in, o check-out ou ambos
  let checkInChange = packageSuggestion && packageSuggestion.checkIn.getTime() !== userCheckIn.getTime();
  let checkOutChange = packageSuggestion && packageSuggestion.checkOut.getTime() !== userCheckOut.getTime();
  let suggestionMessage = `Encontramos um pacote para você!`;

  if (checkInChange && checkOutChange) {
    suggestionMessage += ` Você pode alterar seu check-in para ${packageSuggestion.checkIn.toLocaleDateString()} e seu check-out para ${packageSuggestion.checkOut.toLocaleDateString()} sem pagar nada a mais.`;
  } else if (checkInChange) {
    suggestionMessage += ` Você pode alterar seu check-in para ${packageSuggestion.checkIn.toLocaleDateString()} sem pagar nada a mais.`;
  } else if (checkOutChange) {
    suggestionMessage += ` Você pode alterar seu check-out para ${packageSuggestion.checkOut.toLocaleDateString()} sem pagar nada a mais.`;
  }

  return {
    totalPrice: finalPrice,
    bestOption,
    packageSuggestion: packageSuggestion
      ? {
          checkIn: packageSuggestion.checkIn,
          checkOut: packageSuggestion.checkOut,
          message: suggestionMessage,
        }
      : null,
  };
}

export default calculateAccommodationPrice;
