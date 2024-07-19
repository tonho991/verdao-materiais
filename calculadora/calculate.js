let searchParams = new URLSearchParams(window.location.search);
let type = searchParams.get("type");
let length = searchParams.get("length");

if (length) {
  if (length.indexOf("x") < 0) {
    length = ["120", "160"]
  } else {
    length = length.toLowerCase().split("x");

    if (length.length != 2 && (!isNaN(length[0]) || !isNaN(length[0]))) {
      length = ["120", "160"]
    }
  }
}

if (type) {
  switch (type) {
    case "piso":
      if (length) $("#floorDialogTitle").html(`Calcular Piso (${length[0]}x${length[1]})`)
      $("#modal-piso").modal("show");
      break;
    case "tinta":
      $("#tintDialogTitle").html("Calcular Uso de Tinta");
      $("#modal-tinta").modal("show");
      break;
    case "massa-corrida":
      $("#tintDialogTitle").html("Calcular Uso de Massa Corrida");
      $("#modal-tinta").modal("show");
      break;
    case "selador":
      $("#tintDialogTitle").html("Calcular Uso de Selador");
      $("#modal-tinta").modal("show");
      break;
    case "telha":
      $("#modal-telha").modal("show");
      break;
    default:
      break;
  }
}

$("#show-modal-floor").on("click", () => {
  $("#modal-piso").modal("show");
});

$("#show-modal-tint").on("click", () => {
  $("#modal-tinta").modal("show");
});

$("#show-modal-tile").on("click", () => {
  $("#modal-telha").modal("show");
});

$("#btn-calc").on("click", () => {
  calcularPiso();
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

function calcularPiso() {
  let convenientWidth = parseFloat($("#convenient-width-input").val()) || 0;
  let convenientLength = parseFloat($("#convenient-length-input").val()) || 0;
  let lossPercent = $("#loss-percent-button").is(":checked") ? 10 : 0;


  if (convenientWidth <= 0 || convenientLength <= 0) {
    $("#result").html("Os valores nao pode ser menor que 0.");
    return;
  }

  const itemHeight = parseFloat(length[0]);
  const itemWidth = parseFloat(length[1]);

  //exemplo de piso 120x60
  let itemArea = (itemWidth / 100) * (100 / item);
  let convenientArea = convenientWidth * convenientLength;

  let items = (convenientArea / itemArea).toFixed(0);

  let finalItems = (lossPercent = 0
    ? items
    : (items * (1 + lossPercent / 100)).toFixed(0));

  $("#result").html(
    `Quantidade de peças necessárias ${lossPercent <= 0 ? "" : ", considerando a taxa de perca"
    }: ${finalItems}`
  );
}

function calcularTinta() {
  let convenientArea = parseFloat($("#total-area-input").val()) || 0;
  let openArea = parseFloat($("#tint-total-open-area-input").val()) || 0;
  let totalCoat = parseFloat($("#tint-coat-input").val()) || 0;
  let lossPercent = $("#tint-loss-percent-button").is(":checked") ? 10 : 0;

  if (type) {
    switch (type) {
      case "piso":

      case "massa-corrida":
        $("tintDialogTitle").html("Calcular Uso de Massa Corrida");
        break;
      case "selador":
        $("tintDialogTitle").html("Calcular Uso de Selador");
        break;
    }

  }

  if ($("#unknow-area-button").is(":checked")) {
    let width = parseFloat($("#tint-convenient-width-input").val());
    let height = parseFloat($("#convenient-height-input").val());

    convenientArea = width * height;
  }

  if (convenientArea <= 0 || openArea <= 0 || totalCoat <= 0) {
    $("#tint-result").html("Os valores nao podem ser menor que 0 ou nulo.");
    return;
  }


  convenientArea = convenientArea - openArea;

  /*
  Rendimentos:

  0.572 para massa corrida
  0.180 selador acrilico
  0.04 para tinta acrilica padrao
  */

  let rendimento;

  if (type == "selador") rendimento = 0.180;
  else if (type == "massa-corrida") rendimento = 0.572;
  else rendimento = 0.04;

  console.log(rendimento);

  let finalValue = convenientArea * rendimento;

  finalValue = finalValue * totalCoat;

  finalValue =
    lossPercent == 0
      ? finalValue.toFixed(2)
      : (finalValue * (1 + lossPercent / 100)).toFixed(2);

  $("#tint-result").html(
    `Quantidade <strong>aproximado</strong> de litros necessários ${lossPercent == 0 ? "" : ", considerando a taxa de perca"
    } : ${finalValue}L`
  );
}


function calcularTelha() {
  let width = parseFloat($('#tile-convenient-width-input').val()) || 0;
  let length = parseFloat($('#tile-convenient-length-input').val()) || 0;
  let lossPercent = $('#tile-loss-percent-button').is(':checked');
  let unitsPerSquareMeter = parseFloat($('#tiles-type').val()) || 0;
  let slope = parseFloat($('#roof-degree-input').val()) || 0;

  if (width <= 0 || length <= 0 || unitsPerSquareMeter <= 0) {
    $("#tile-result").html("Os valores nao podem ser menor que 0 ou nulo.");
    return;
  }

  let area = width * length;

  let tiles = 0;

  if (slope !== 0) {
    const slopeRadians = (slope * Math.PI) / 180;
    const horizontalProjection = width * Math.cos(slopeRadians)
    const efectiveArea = horizontalProjection * length;
    tiles = efectiveArea * unitsPerSquareMeter;

  } else {
    tiles = area * unitsPerSquareMeter;
  }

  if (lossPercent) {
    tiles = (tiles * 1.10)
  }

  $('#tile-result').html(`Quantidade <strong>aproximado</strong> de telhas necessárias ${lossPercent <= 0 ? "" : ", considerando a taxa de perda"}: ${tiles.toFixed(0)}`);
}