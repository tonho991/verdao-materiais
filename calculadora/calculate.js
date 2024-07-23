/* obtendo parâmetros da url [type= piso, massa-corrida, selador, tinta, telha | length= tamanho do piso (ex. 40x40) ] */
let searchParams = new URLSearchParams(window.location.search);
let type = searchParams.get("type");
let length = searchParams.get("length");

/* fazendo a conversão do comprimento (length) para lista de números. [0=base | 1=altura] */
if (length) {
  if (length.indexOf("x") < 0) {
    length = ["120", "160"];
  } else {
    length = length.toLowerCase().split("x");

    if (length.length != 2 && (!isNaN(length[0]) || !isNaN(length[0]))) {
      length = ["120", "160"];
    }
  }
}

/* obtendo o tipo de item dado pelo parâmetro da url, e mostrando o PopUp de acordo com o tipo. */
if (type) {
  switch (type) {
    case "piso":
      if (length)
        $("#floorDialogTitle").html(
          `Calcular Piso (${length[0]}x${length[1]})`
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

/* obtendo os tipos de telha e mostrando no PopUp (a variável "tileData" está no arquivo constants.js) */
$("#roof-type").change(function () {
  let type = $(this).val();
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
  let itemWidth = parseFloat(length[0]);
  let itemHeight = parseFloat(length[1]);

  /* verificando se os valores do cômodo são nulos. */
  if (convenientWidth <= 0 || convenientLength <= 0) {
    $("#result").html("Os valores nao pode ser menor que 0.");
    return;
  }

  /* obtento a área do cômodo. */
  let convenientArea = convenientWidth * convenientLength;

  /* obtendo a área do piso. */
  let itemArea = (itemWidth / 100) * (itemHeight / 100);
  let items = (convenientArea / itemArea).toFixed(0);

  /* verificando se o checkbox está ativado, e aplicando 10% de taxa de perda. */
  let finalItems = $("#loss-percent-button").is(":checked")
    ? items
    : (items * (1 + lossPercent / 100)).toFixed(0);

  /* imprimindo o resultado */
  $("#result").html(
    `Quantidade <strong>aproximada</strong> de peças necessárias ${
      $("#loss-percent-button").is(":checked") 
      ? ", considerando a taxa de perda." 
      : ""
    }: ${finalItems}`
  );
}

/* Metódo de Cálculo de Tinta */
function calcularTinta() {
  let convenientArea = parseFloat($("#total-area-input").val()) || 0;
  let openArea = parseFloat($("#tint-total-open-area-input").val()) || 0;
  let totalCoat = parseFloat($("#tint-coat-input").val()) || 0;
  let lossPercent = $("#tint-loss-percent-button").is(":checked") ? 10 : 0;

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
    let width = parseFloat($("#tint-convenient-width-input").val());
    let height = parseFloat($("#convenient-height-input").val());

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
      ? ", considerando a taxa de perca"
      : ""
    } : ${finalValue}L`
  );
}

/* Metódo de Cálculo de Telha */
function calcularTelha() {
  let width = parseFloat($("#tile-convenient-width-input").val()) || 0;
  let length = parseFloat($("#tile-convenient-length-input").val()) || 0;
  let unitsPerSquareMeter = parseFloat($("#tiles-type").val()) || 0;
  let slope = parseFloat($("#roof-degree-input").val()) || 0;

  /* verificando se os valores do cômodo são nulos. */
  if (width <= 0 || length <= 0 || unitsPerSquareMeter <= 0) {
    $("#tile-result").html("Os valores nao podem ser menor que 0 ou nulo.");
    return;
  }

  /* obtendo a área do telhado */
  let area = width * length;

  let tiles = 0;
  if (slope !== 0) {
    /* cálculo da área do telhado com o grau (slope) do telhado. [ Math.PI = 3,14... | Math.cos = cálculo do cosceno. ]*/
    const slopeRadians = (slope * Math.PI) / 180;
    const horizontalProjection = width * Math.cos(slopeRadians);
    const efectiveArea = horizontalProjection * length;

    /* multiplicando a área efetiva do telhado pela unidade por m² da telha. */
    tiles = efectiveArea * unitsPerSquareMeter;
  } else {
    /* multiplicando a área do telhado pela unidade por m² da telha. */
    tiles = area * unitsPerSquareMeter;
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
    }: ${tiles.toFixed(0)}`
  );
}
