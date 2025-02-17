function calcularDataCarnaval(ano) {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;

  // Retorna o domingo de Carnaval
  return new Date(ano, mes - 1, dia);
}

function isCarnaval(ano) {
  // Calcula a data do domingo de Carnaval
  const dataCarnaval = calcularDataCarnaval(ano);

  // Sexta-feira antes do domingo de Carnaval
  const sextaAnterior = new Date(dataCarnaval);
  sextaAnterior.setDate(dataCarnaval.getDate() - 2); // Subtrai 2 dias para sexta-feira

  // Terça-feira depois do domingo de Carnaval
  const tercaPosterior = new Date(dataCarnaval);
  tercaPosterior.setDate(dataCarnaval.getDate() + 2); // Soma 2 dias para terça-feira

  // Constrói o intervalo de sexta a terça-feira
  const intervalo = [];
  for (let d = new Date(sextaAnterior); d <= tercaPosterior; d.setDate(d.getDate() + 1)) {
    intervalo.push(new Date(d));
  }

  return intervalo;
}

function isRevellion(ano) {
  // Data inicial e final padrão do Réveillon
  const inicio = new Date(ano, 11, 27); // 27 de Dezembro
  const fim = new Date(ano + 1, 0, 2); // 2 de Janeiro

  // Verifica se 2 de Janeiro é sexta-feira ou sábado
  const dayOfWeek = fim.getDay(); // 0 = domingo, 5 = sexta, 6 = sábado
  if (dayOfWeek === 5 || dayOfWeek === 6) {
    // Extende o evento até domingo
    fim.setDate(fim.getDate() + (7 - dayOfWeek));
  }

  // Construa o intervalo de datas
  const intervalo = [];
  for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
    intervalo.push(new Date(d));
  }

  return intervalo;
}

function isFenfit(ano) {
  // Primeiro dia de julho do ano especificado
  const firstDayOfJuly = new Date(ano, 6, 1);

  // Determine o dia da semana (0 = domingo, 6 = sábado)
  const dayOfWeekOfFirstDay = firstDayOfJuly.getDay();

  // Calcule o dia da sexta-feira da terceira semana de julho
  const startDayOfThirdWeek = 15 - (dayOfWeekOfFirstDay <= 5 ? dayOfWeekOfFirstDay + 1 : dayOfWeekOfFirstDay - 6); // Ajuste para sexta-feira
  const startDate = new Date(ano, 6, startDayOfThirdWeek); // Data de início do Fenfit (sexta-feira)

  // Calcule o domingo da semana seguinte (9 dias depois da sexta-feira)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 9); // Incrementa 9 dias para o domingo da próxima semana

  // Construa o intervalo de datas
  const intervalo = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    intervalo.push(new Date(d));
  }

  return intervalo;
}

export const specialDate = {
  calcularDataCarnaval,
  isCarnaval,
  isRevellion,
  isFenfit,
};
