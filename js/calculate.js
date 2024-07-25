/* obtendo parâmetros da url [type= piso, massa-corrida, selador, tinta, telha | area= tamanho do piso (ex. 40x40) ] */
let searchParams = new URLSearchParams(window.location.search);
let type = searchParams.get("type");
let area = searchParams.get("area");

/* configuração do tooltip */
$('[data-toggle="tooltip"]').tooltip();
$("body").tooltip({
  selector: '[data-toggle="tooltip"]',
  trigger: "hover focus click manual",
});

/* fazendo a conversão do comprimento (length) para lista de números. [0=base | 1=altura] */
if (area) {
  if (area.indexOf("x") < 0) {
    area = ["40", "40"];
  } else {
    area = area.toLowerCase().split("x");

    if (area.length != 2 && (!isNaN(area[0]) || !isNaN(area[1]))) {
      area = ["40", "40"];
    }
  }

  /* Definindo os valores da area no input do Piso */
  $("#floor-width-input").val(area[0]);
  $("#floor-length-input").val(area[1]);
}

/* obtendo o tipo de item dado pelo parâmetro da url, e mostrando o PopUp de acordo com o tipo. */
if (type) {
  switch (type) {
    case "piso":
      if (area)
        $("#floorDialogTitle").html(
          `Calcular Medidas Do Porcelanato (${area[0]}x${area[1]})`
        );
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

/* mostrando o PopUp pelo clique do botão */
$("#show-modal-floor").on("click", () => {
  $("#modal-piso").modal("show");
});

$("#show-modal-tint").on("click", () => {
  $("#modal-tinta").modal("show");
});

$("#show-modal-tile").on("click", () => {
  $("#modal-telha").modal("show");
});

/* final */

/* fazendo o cálculo dos itens quando clicado no botão de calcular. */
$("#btn-calc").on("click", () => {
  calcularPiso();
});

$("#tint-btn-calc").on("click", () => {
  calcularTinta();
});

$("#tile-btn-calc").on("click", () => {
  calcularTelha();
});

/* final */

/* mostrando os inputs de largura e altura quando a área for desconhecida (somente do tipo tinta). */
$("#unknown-area-button").change(function () {
  if ($(this).is(":checked")) {
    $("#unknown-area-container").css("display", "block");
    $("#tint-convenient-area").css("display", "none");
  } else {
    $("#unknown-area-container").css("display", "none");
    $("#tint-convenient-area").css("display", "block");
  }
});

/* obtendo os tipos de telha e mostrando no PopUp (a variável "tileData" está no arquivo constants.js) */
$("#roof-type").change(function () {
  let type = $(this).val();

  if (type === "unknown") {
    $("#tile-unknown-area-container").show();
    $("#calculate-content").show();
    $("#tiles-options").hide();
  } else {
    $("#tile-unknown-area-container").hide();
    $("#ceramica-options").hide();
    $("#measurements").hide();
    $("#tiles-type").empty();

    $("#tiles-type").append(
      `<option value="" disabled selected>Selecione o Tipo de Telha ${tileData[type].title} </option>`
    );
    tileData[type].list.forEach((tile) => {
      $("#tiles-type").append(
        `<option value="${tile.unit}">${tile.name}</option>`
      );
    });
    $("#tiles-options").show();
  }
});

/* fim */

/* mostrando o layout de inputs de cálculo quando o tipo de telha for selecionado. */
$("#tiles-type").change(function () {
  $("#calculate-content").show();
});

/* fim */

/* Metódo de Cálculo de Piso */
function calcularPiso() {
  let convenientWidth = parseFloat($("#convenient-width-input").val()) || 0;
  let convenientLength = parseFloat($("#convenient-length-input").val()) || 0;
  let itemWidth = parseFloat($("#floor-width-input").val()) || 0;
  let itemLength = parseFloat($("#floor-length-input").val()) || 0;

  /* verificando se os valores do cômodo são nulos. */
  if (
    convenientWidth <= 0 ||
    convenientLength <= 0 ||
    itemLength <= 0 ||
    itemWidth <= 0
  ) {
    $("#result").html("Os valores inseridos não pode ser menor ou igual a 0.");
    return;
  }

  /* obtento a área do cômodo. */
  let convenientArea = convenientWidth * convenientLength;

  /* obtendo a área do piso. */
  let itemArea = (itemWidth / 100) * (itemLength / 100);
  let items = (convenientArea / itemArea).toFixed(0);

  /* verificando se o checkbox está ativado, e aplicando 10% de taxa de perda. */
  let finalItems = $("#loss-percent-button").is(":checked")
    ? (items * 1.1).toFixed(0)
    : items;

  /* imprimindo o resultado */
  $("#result").html(
    `Quantidade <strong>aproximada</strong> de peças necessárias ${
      $("#loss-percent-button").is(":checked")
        ? ", considerando a taxa de perda"
        : ""
    }: ${finalItems}`
  );
}

/* Metódo de Cálculo de Tinta */
function calcularTinta() {
  let convenientArea = parseFloat($("#tint-total-area-input").val()) || 0;
  let openArea = parseFloat($("#tint-total-open-area-input").val()) || 0;
  let totalCoat = parseFloat($("#tint-coat-input").val()) || 0;

  /* Verificando o tipo de item, e colocando o titulo de acordo com o tipo. */
  if (type) {
    switch (type) {
      case "massa-corrida":
        $("tintDialogTitle").html("Calcular Uso de Massa Corrida");
        break;
      case "selador":
        $("tintDialogTitle").html("Calcular Uso de Selador");
        break;
    }
  }

  /* verificando se o checkbox da área desconhecida está ativado, e fazendo o cálculo da área. */
  if ($("#unknow-area-button").is(":checked")) {
    let width = parseFloat($("#tint-unk-convenient-width-input").val());
    let height = parseFloat($("#tint-unk-convenient-height-input").val());

    convenientArea = width * height;
  }

  /* verificando se os valores do cômodo são nulos. */
  if (convenientArea <= 0 || openArea <= 0 || totalCoat <= 0) {
    $("#tint-result").html("Os valores nao podem ser menor que 0 ou nulo.");
    return;
  }

  /* subtraindo a área do cômodo pela área de abertura (ex. porta, janela). */
  convenientArea = convenientArea - openArea;

  /* obtendo o valor do rendimento de acordo como o tipo (tinta, selador, massa corrida). */
  let rendimento;
  if (type == "selador") rendimento = 0.18;
  else if (type == "massa-corrida") rendimento = 0.572;
  else rendimento = 0.04;

  /* multiplicando a área do cômodo pelo rendimento do item. */
  let finalValue = convenientArea * rendimento;

  /* multiplicando o valor pelo total de demão aplicado */
  finalValue = finalValue * totalCoat;

  /* verificando se o checkbox está ativado, e aplicando 10% de taxa de perda. */
  finalValue = $("#tint-loss-percent-button").is(":checked")
    ? (finalValue * 1.1).toFixed(2)
    : finalValue.toFixed(2);

  /* imprimindo o resultado */
  $("#tint-result").html(
    `Quantidade <strong>aproximada</strong> de litros necessários ${
      $("#tint-loss-percent-button").is(":checked")
        ? ", considerando a taxa de perda"
        : ""
    } : ${finalValue}L`
  );
}

/* Metódo de Cálculo de Telha */
function calcularTelha() {
  let base = parseFloat($("#tile-convenient-width-input").val()) || 0;
  let height = parseFloat($("#tile-convenient-length-input").val()) || 0;
  let unitsPerSquareMeter = parseFloat($("#tiles-type").val()) || 0;
  let slope = parseFloat($("#roof-degree-input").val()) || 0;

  /* verificando se os valores do cômodo são nulos. */
  if (base <= 0 || height <= 0) {
    $("#tile-result").html("Os valores nao podem ser menor que 0 ou nulo.");
    return;
  }

  /* obtendo a área do telhado */
  let roofArea = base * height;
  let efectiveArea;

  /* cálculo da área do telhado com o grau (slope) do telhado. [ Math.PI = 3,14... | Math.cos = cálculo do cosceno. ]*/
  if (slope != 0 && !slope < 0) {
    const slopeRadians = (slope * Math.PI) / 180;
    const horizontalProjection = base * Math.cos(slopeRadians);
    efectiveArea = horizontalProjection * height;
  }

  let tiles = 0;

  if ($("#roof-type").val() === "unknown") {
    const tileBase =
      parseFloat($("#tile-unk-convenient-width-input").val()) || 0;
    const tileHeight =
      parseFloat($("#tile-unk-convenient-height-input").val()) || 0;

    if (tileBase <= 0 || tileHeight <= 0) {
      $("#tile-result").html("Os valores não podem ser menor que 0 ou nulo.");
      return;
    }

    const tileArea = (tileBase / 100) * (tileHeight / 100);

    if (efectiveArea) {
      tiles = efectiveArea / tileArea;
    } else {
      tiles = roofArea / tileArea;
    }
  } else {
    if (efectiveArea) {
      /* multiplicando a área efetiva do telhado pela unidade por m² da telha. */
      tiles = efectiveArea * unitsPerSquareMeter;
    } else {
      /* multiplicando a área do telhado pela unidade por m² da telha. */
      tiles = roofArea * unitsPerSquareMeter;
    }
  }
  /* verificando se o checkbox está ativado, e aplicando 10% de taxa de perda. */
  if ($("#tile-loss-percent-button").is(":checked")) {
    tiles = tiles * 1.1;
  }

  /* imprimindo o resultado */
  $("#tile-result").html(
    `Quantidade <strong>aproximada</strong> de telhas necessárias ${
      $("#tile-loss-percent-button").is(":checked")
        ? ", considerando a taxa de perda"
        : ""
    }: ${tiles.toFixed(0)} telhas.`
  );
}
