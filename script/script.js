window.addEventListener("load", start);
var isNew = true; //flag para identificar se é novo registro ou atualização

function start() {
  var buttonCalcular = document.querySelector("#calcular");
  buttonCalcular.addEventListener("click", calcularDescontos);
  var inputSalario = document.querySelector("#salario-bruto");
  inputSalario.focus();
}

function calcularDescontos(event) {
  var salarioBruto = document.querySelector("#salario-bruto").value;
  var qtdDependentes = document.querySelector("#numero-dependente").value;
  var desc = document.querySelector("#outros-descontos").value;
  if (desc == "") {
    desc = 0;
  }
  if (!isNew) {
    var rowSalarioBruto = document.querySelector("#rowSalarioBruto");
    rowSalarioBruto.remove();
    var rowSalarioINSS = document.querySelector("#rowSalarioINSS");
    rowSalarioINSS.remove();
    var rowSalarioIR = document.querySelector("#rowSalarioIR");
    rowSalarioIR.remove();
    var rowSalarioTotal = document.querySelector("#rowSalarioTotal");
    rowSalarioTotal.remove();
    var rowSalarioResul = document.querySelector("#rowSalarioResul");
    rowSalarioResul.remove();
    var rowOutrosDescontos = document.querySelector("#rowOutrosDescontos");
    rowOutrosDescontos.remove();
  }

  var salarioDescInss = descontoInss(salarioBruto, desc);
  var salarioDescIr = descontoIr(salarioDescInss.salario, qtdDependentes);
  // console.log('descontos - ' + salarioDescInss.salario);
  var SalarioFinal =
    salarioBruto -
    (parseFloat(salarioDescInss.valorDescontado) +
      parseFloat(salarioDescIr.valorDescontado));
  renderSalarioBruto(parseFloat(salarioBruto));
  renderINSS(salarioDescInss);
  renderIR(salarioDescIr);
  renderOutrosDescontos(parseFloat(desc));
  renderTotal(parseFloat(salarioBruto), SalarioFinal.toFixed(2), desc);
  isNew = false;
}
//cáculo de desconto de INSS e outros descontos informados
function descontoInss(salarioInss, descOutro) {
  // console.log('descOutro - ' + descOutro);
  var returnSalario;
  var desconto;

  if (salarioInss <= parseFloat(1045.0)) {
    returnSalario = salarioInss * (7.5 / 100);
    desconto = "7,5%";
    // console.log('desconto 7,5% - ' + returnSalario);
  } else if (
    salarioInss > parseFloat(1045.0) &&
    salarioInss <= parseFloat(2089.6)
  ) {
    returnSalario = salarioInss * (9 / 100) - parseFloat(15.684);
    desconto = "9%";
    // console.log('desconto 9% - ' + returnSalario);
  } else if (
    salarioInss > parseFloat(2089.6) &&
    salarioInss <= parseFloat(3134.4)
  ) {
    returnSalario = salarioInss * (12 / 100) - parseFloat(78.378);
    desconto = "12%";
    // console.log('desconto 12% - ' + returnSalario);
  } else if (
    salarioInss > parseFloat(3134.4) &&
    salarioInss <= parseFloat(6101.06)
  ) {
    returnSalario = salarioInss * (14 / 100) - parseFloat(141.068);
    desconto = "14%";
    // console.log('desconto 14% - ' + returnSalario);
  } else {
    returnSalario = parseFloat(713.08);
    desconto = "R$ 713,08";
    //console.log('desconto 14% - ' + returnSalario);
  }

  return {
    descricao: "INSS",
    valorDescontado: returnSalario,
    proventos: "",
    desconto: desconto,
    salario: salarioInss - returnSalario
  };
}
//calculo de desconto de imposto de renda e quantiadde de dependentes
function descontoIr(salarioIR, dependentes) {
  var descIR;
  var descontoIR;

  if (parseFloat(dependentes) > parseFloat(0)) {
    salarioIR = salarioIR - dependentes * parseFloat(189.59);
    // console.log('salarioINSS  DEP- ' + salarioINSS);
  }
  if (salarioIR > parseFloat(1903.98) && salarioIR <= parseFloat(2826.65)) {
    descIR = salarioIR * (7.5 / 100) - parseFloat(142.8);
    descontoIR = "7,5%";
  } else if (
    salarioIR > parseFloat(2826.65) &&
    salarioIR <= parseFloat(3751.05)
  ) {
    descIR = salarioIR * (15 / 100) - parseFloat(354.8);
    descontoIR = "15%";
  } else if (
    salarioIR > parseFloat(3751.05) &&
    salarioIR <= parseFloat(4664.68)
  ) {
    descIR = salarioIR * (22.5 / 100) - parseFloat(636.13);
    descontoIR = "22,5%";
  } else if (salarioIR > parseFloat(4664.68)) {
    descIR = salarioIR * (27.5 / 100) - parseFloat(869.36);
    descontoIR = "27,5%";
  } else {
    descIR = "isento";
    descontoIR = "insento";
  }

  if (descIR < parseFloat(0) || typeof descIR === "string") {
    return {
      descricao: "IRRF",
      valorDescontado: parseFloat(0.0),
      proventos: "",
      salario: "",
      desconto: "Isento"
    };
  } else {
    return {
      descricao: "IRRF",
      valorDescontado: parseFloat(descIR),
      proventos: "",
      salario: "",
      desconto: descontoIR
    };
  }
}
//renderiza Salário Bruto
function renderSalarioBruto(salarioBruto) {
  var table = document.querySelector("#table");
  table.classList.remove("hide-table");

  var bodyTableS = document.querySelector("#body-table");

  var trRetornoS = document.createElement("tr");
  trRetornoS.id = "rowSalarioBruto";

  var tdDescricaoS = document.createElement("td");
  var tdAliquotaS = document.createElement("td");
  var tdProventosS = document.createElement("td");
  var tdDescontosS = document.createElement("td");
  tdDescricaoS.classList.add("negrito");
  tdProventosS.classList.add("green");

  tdDescricaoS.textContent = "Salário Bruto";
  tdAliquotaS.textContent = "";
  tdProventosS.textContent = salarioBruto.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });
  tdDescontosS.textContent = "";

  bodyTableS.appendChild(trRetornoS);
  trRetornoS.appendChild(tdDescricaoS);
  trRetornoS.appendChild(tdAliquotaS);
  trRetornoS.appendChild(tdProventosS);
  trRetornoS.appendChild(tdDescontosS);
}
//renderiza descontos INSS
function renderINSS(salarioInss) {
  var bodyTable = document.querySelector("#body-table");

  var trRetorno = document.createElement("tr");
  trRetorno.id = "rowSalarioINSS";
  var tdDescricao = document.createElement("td");
  var tdAliquota = document.createElement("td");
  var tdProventos = document.createElement("td");
  var tdDescontos = document.createElement("td");
  tdDescricao.classList.add("negrito");
  tdDescontos.classList.add("red");

  tdDescricao.textContent = salarioInss.descricao;
  tdAliquota.textContent = salarioInss.desconto;
  tdProventos.textContent = salarioInss.proventos.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });
  tdDescontos.textContent = salarioInss.valorDescontado.toLocaleString(
    "pt-br",
    { style: "currency", currency: "BRL" }
  );

  bodyTable.appendChild(trRetorno);
  trRetorno.appendChild(tdDescricao);
  trRetorno.appendChild(tdAliquota);
  trRetorno.appendChild(tdProventos);
  trRetorno.appendChild(tdDescontos);
}
//renderiza outros descontos
function renderOutrosDescontos(desc) {
  var bodyTable = document.querySelector("#body-table");

  var trOutrosDescontos = document.createElement("tr");
  trOutrosDescontos.id = "rowOutrosDescontos";
  var tdOutrosDescontosDescricao = document.createElement("td");
  var tdAliquotaOutrosDescontos = document.createElement("td");
  var tdProventosOutrosDescontos = document.createElement("td");
  var tdDescontosOutrosDescontos = document.createElement("td");
  tdOutrosDescontosDescricao.classList.add("negrito");
  tdDescontosOutrosDescontos.classList.add("red");

  tdOutrosDescontosDescricao.textContent = "Outros descontos";
  tdAliquotaOutrosDescontos.textContent = "";
  tdProventosOutrosDescontos.textContent = "";
  tdDescontosOutrosDescontos.textContent = desc.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });

  bodyTable.appendChild(trOutrosDescontos);
  trOutrosDescontos.appendChild(tdOutrosDescontosDescricao);
  trOutrosDescontos.appendChild(tdAliquotaOutrosDescontos);
  trOutrosDescontos.appendChild(tdProventosOutrosDescontos);
  trOutrosDescontos.appendChild(tdDescontosOutrosDescontos);
}
//renderiza descontos IRRF
function renderIR(salarioIR) {
  var bodyTable = document.querySelector("#body-table");

  var trRetornoIR = document.createElement("tr");
  trRetornoIR.id = "rowSalarioIR";
  var tdDescricaoIR = document.createElement("td");
  var tdAliquotaIR = document.createElement("td");
  var tdProventosIR = document.createElement("td");
  var tdDescontosIR = document.createElement("td");
  tdDescricaoIR.classList.add("negrito");
  tdDescontosIR.classList.add("red");

  tdDescricaoIR.textContent = salarioIR.descricao;
  tdAliquotaIR.textContent = salarioIR.desconto;
  tdProventosIR.textContent = salarioIR.proventos.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });
  tdDescontosIR.textContent = salarioIR.valorDescontado.toLocaleString(
    "pt-br",
    { style: "currency", currency: "BRL" }
  );

  bodyTable.appendChild(trRetornoIR);
  trRetornoIR.appendChild(tdDescricaoIR);
  trRetornoIR.appendChild(tdAliquotaIR);
  trRetornoIR.appendChild(tdProventosIR);
  trRetornoIR.appendChild(tdDescontosIR);
}
//renderiza soma dos descontos e salairo final
function renderTotal(salarioBruto, SalarioFinal, desc) {
  var saldoFinal = parseFloat(salarioBruto) - parseFloat(SalarioFinal);
  console.log("saldo final - " + saldoFinal);
  saldoFinal = saldoFinal + parseFloat(desc);
  var bodyTable = document.querySelector("#body-table");
  SalarioFinal = salarioBruto - saldoFinal;

  console.log("saldo final - " + saldoFinal);
  var trRetornoTotal = document.createElement("tr");
  trRetornoTotal.id = "rowSalarioTotal";
  trRetornoTotal.classList.add("gray");
  var tdDescricaoTotal = document.createElement("td");
  var tdAliquotaTotal = document.createElement("td");
  var tdProventosTotal = document.createElement("td");
  var tdDescontosTotal = document.createElement("td");
  tdDescricaoTotal.classList.add("negrito");
  tdDescontosTotal.classList.add("red");
  tdProventosTotal.classList.add("green");

  tdDescricaoTotal.textContent = "Total";
  tdAliquotaTotal.textContent = "";
  tdProventosTotal.textContent = salarioBruto.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });
  tdDescontosTotal.textContent = saldoFinal.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });

  bodyTable.appendChild(trRetornoTotal);
  trRetornoTotal.appendChild(tdDescricaoTotal);
  trRetornoTotal.appendChild(tdAliquotaTotal);
  trRetornoTotal.appendChild(tdProventosTotal);
  trRetornoTotal.appendChild(tdDescontosTotal);

  //resultado final

  var trRetornoResul = document.createElement("tr");
  trRetornoResul.id = "rowSalarioResul";
  trRetornoResul.classList.add("gray");
  var tdDescricaoResul = document.createElement("td");
  var tdAliquotaResul = document.createElement("td");
  var tdProventosResul = document.createElement("td");
  var tdDescontosResul = document.createElement("td");
  tdDescricaoResul.classList.add("negrito");
  tdDescontosResul.classList.add("green");

  tdDescricaoResul.textContent = "Resultado";
  tdAliquotaResul.textContent = "";
  tdProventosResul.textContent = "";
  tdDescontosResul.textContent = SalarioFinal.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL"
  });

  bodyTable.appendChild(trRetornoResul);
  trRetornoResul.appendChild(tdDescricaoResul);
  trRetornoResul.appendChild(tdAliquotaResul);
  trRetornoResul.appendChild(tdProventosResul);
  trRetornoResul.appendChild(tdDescontosResul);
}
