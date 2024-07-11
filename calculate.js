$("#modal-telha").modal("show");

$("#btn-calc").on("click", () => {
  calculate();
});

$("#tint-btn-calc").on("click", () => {
  calcularTinta();
});

$("#tile-btn-calc").on("click", () => {
  calcularTelha()
})

$("#unknow-area-button").change(function () {
  if ($(this).is(":checked")) {
    $("#tint-convenient-width-box").css("display", "block");
    $("#tint-convenient-height-box").css("display", "block");
    $("#tint-convenient-area").css("display", "none");
  } else {
    $("#tint-convenient-width-box").css("display", "none");
    $("#tint-convenient-height-box").css("display", "none");
    $("#tint-convenient-area").css("display", "block");
  }
});

$("#roof-type").change(function () {
  let type = $(this).val();
  $("#ceramica-options").hide();
  $("#measurements").hide();
  $("#tiles-type").empty();

  $("#tiles-type").append(`<option value="" disabled selected>Selecione o Tipo de Telha ${tileData[type].title} </option>`)
  tileData[type].list.forEach((tile) => {
    $("#tiles-type").append(
      `<option value="${tile.unit}">${tile.name}</option>`
    );
  });

  $('#tiles-options').show();
});

$("#tiles-type").change(function () {
  $("#calculate-content").show();
});

function calculate() {
  let convenientWidth = parseFloat($("#convenient-width-input").val());
  let convenientLength = parseFloat($("#convenient-length-input").val());
  let lossPercent = $("#loss-percent-button").is(":checked") ? 10 : 0;

  //exemplo de piso 120x60

  let itemArea = (120 / 100) * (100 / 60);
  let convenientArea = convenientWidth * convenientLength;

  let items = (convenientArea / itemArea).toFixed(0);

  let finalItems = (lossPercent = 0
    ? items
    : (items * (1 + lossPercent / 100)).toFixed(0));

  $("#result").html(
    `Quantidade de peças necessárias ${
      lossPercent <= 0 ? "" : ", considerando a taxa de perca"
    }: ${finalItems}`
  );
}

function calcularTinta() {
  let convenientArea = parseFloat($("#total-area-input").val());
  let openArea = parseFloat($("#tint-total-open-area-input").val());
  let totalCoat = parseFloat($("#tint-coat-input").val());
  let lossPercent = $("#tint-loss-percent-button").is(":checked") ? 10 : 0;

  if ($("#unknow-area-button").is(":checked")) {
    let width = parseFloat($("#tint-convenient-width-input").val());
    let height = parseFloat($("#convenient-height-input").val());

    convenientArea = width * height;
  }

  convenientArea = convenientArea - openArea;

  /*
  Rendimentos:

  0.572 para massa corrida
  0.180 selador acrilico
  0.04 para tinta acrilica padrao
  */

  const rendimento = 0.18;

  let finalValue = convenientArea * rendimento;

  finalValue = finalValue * totalCoat;

  finalValue =
    lossPercent == 0
      ? finalValue.toFixed(2)
      : (finalValue * (1 + lossPercent / 100)).toFixed(2);

  $("#tint-result").html(
    `Quantidade de litros necessárias${
      lossPercent == 0 ? "" : ", considerando a taxa de perca"
    } : ${finalValue}`
  );
}


function calcularTelha(){
  let width = parseFloat($('#tile-convenient-width-input').val());
  let length = parseFloat($('#tile-convenient-length-input').val());
  let lossPercent = $('#tile-loss-percent-button').is(':checked') ? 10 : 0;
  let area = width * length;
  let unitsPerSquareMeter = parseFloat($('#tiles-type').val());

  let totalUnits = (area * unitsPerSquareMeter).toFixed(0);
  let finalUnits = lossPercent === 0 ? totalUnits : (totalUnits * (1 + lossPercent / 100)).toFixed(0);

  $('#tile-result').html(`Quantidade de peças necessárias ${lossPercent <= 0 ? "" : ", considerando a taxa de perda"}: ${finalUnits}`);

}