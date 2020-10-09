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
  if (desc === "") {
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
  render(
    parseFloat(salarioBruto),
    salarioDescInss,
    desc,
    salarioDescIr,
    SalarioFinal
  );

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

function render(salarioBruto, salarioInss, desc, salarioIR, SalarioFinal) {
  console.log("render");
  var table = document.querySelector("#table");
  table.classList.remove("hide-table");
  let saldoFinal = parseFloat(salarioBruto) - parseFloat(SalarioFinal);
  saldoFinal = saldoFinal + parseFloat(desc);
  var tableBody = document.querySelector("#body-table");

  const infoTable = ` <tbody id="body-table">
    <tr id="rowSalarioBruto">
      <td class="negrito">Salário Bruto</td>
      <td></td>
      <td class="green">${salarioBruto.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      })}</td>
      <td></td>
    </tr>
    <tr id="rowSalarioINSS">
      <td class="negrito">${salarioInss.descricao}</td>
      <td>${salarioInss.desconto}</td>
      <td></td>
      <td class="red">${salarioInss.proventos.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      })}</td>
    </tr>
    <tr id="rowSalarioIR">
      <td class="negrito">${salarioIR.descricao}</td>
      <td>${salarioIR.desconto}</td>
      <td></td>
      <td class="red">${salarioIR.valorDescontado.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      })}</td>
      </tr>
    <tr id="rowOutrosDescontos">
      <td class="negrito">Outros descontos</td>
      <td></td>
      <td></td>
      <td class="red">${desc.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      })}</td>
    </tr>
    <tr id="rowSalarioTotal" class="gray">
      <td class="negrito">Total</td>
      <td></td>
      <td class="green">${salarioBruto.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      })}</td>
      <td class="red">${saldoFinal.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      })}</td>
    </tr>
    <tr id="rowSalarioResul" class="gray">
      <td class="negrito">Resultado</td>
      <td></td>
      <td></td>
      <td class="green">${SalarioFinal.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      })}</td>
    </tr>
    </tbody>`;
  console.log(infoTable);
  tableBody.innerHTML = infoTable;
  //tableBody.textContent = infoTable;
}
