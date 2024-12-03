// Obtendo parâmetros da URL
const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const area = params.get("area");

// Inicialização do tooltip
$("[data-toggle='tooltip']").tooltip();
$("body").tooltip({
  selector: "[data-toggle='tooltip']",
  trigger: "hover focus click manual",
});

// Processamento de área
function parseArea(area) {
  if (!area || !area.includes("x")) return ["40", "40"];

  const dimensions = area.toLowerCase().split("x").map(Number);
  return dimensions.length === 2 && dimensions.every((dim) => !isNaN(dim))
    ? dimensions
    : ["40", "40"];
}

const [areaWidth, areaHeight] = parseArea(area);

$("#floor-width-input").val(areaWidth);
$("#floor-length-input").val(areaHeight);

// Exibição do modal baseado no tipo
function showModalByType(type, area) {
  const titles = {
    piso: `Calcular Medidas Do Porcelanato (${area[0]}x${area[1]})`,
    tinta: "Calcular Uso de Tinta",
    "massa-corrida": "Calcular Uso de Massa Corrida",
    selador: "Calcular Uso de Selador",
    telha: "",
  };

  const modals = {
    piso: "#modal-piso",
    tinta: "#modal-tinta",
    "massa-corrida": "#modal-tinta",
    selador: "#modal-tinta",
    telha: "#modal-telha",
  };

  if (titles[type]) $("#tintDialogTitle").html(titles[type]);
  if (modals[type]) $(modals[type]).modal("show");
}

if (type) showModalByType(type, [areaWidth, areaHeight]);

// Eventos de clique para exibir modais
$("#show-modal-floor").on("click", () => $("#modal-piso").modal("show"));
$("#show-modal-tint").on("click", () => $("#modal-tinta").modal("show"));
$("#show-modal-tile").on("click", () => $("#modal-telha").modal("show"));

// Eventos de cálculo
$("#btn-calc").on("click", calcularPiso);
$("#tint-btn-calc").on("click", calcularTinta);
$("#tile-btn-calc").on("click", calcularTelha);

// Alternar visibilidade de inputs para área desconhecida
$("#unknown-area-button").change(function () {
  $("#unknown-area-container").toggle(this.checked);
  $("#tint-convenient-area").toggle(!this.checked);
});

// Mudança no tipo de telha
$("#roof-type").change(function () {
  const type = $(this).val();
  $("#ceramica-options, #measurements").hide();
  $("#tiles-type").empty();

  const tileOptions = tileData[type]?.list || [];
  $("#tiles-type").append(
    `<option value="" disabled selected>Selecione o Tipo de Telha ${tileData[type]?.title || ""}</option>`
  );

  tileOptions.forEach(({ unit, name }) => {
    $("#tiles-type").append(`<option value="${unit}">${name}</option>`);
  });

  $("#tiles-options").show();
  $("#tile-waring").html(
    type === "fibrocimento"
      ? "O cálculo da quantidade de telhas <strong>não</strong> inclui a inclinação de 35%."
      : "O cálculo da quantidade de telhas inclui a inclinação de 35%."
  );
});

// Mostrar layout de inputs ao selecionar tipo de telha
$("#tiles-type").change(() => $("#calculate-content").show());

// Funções de cálculo
function calcularPiso() {
  const convenientWidth = parseFloat($("#convenient-width-input").val()) || 0;
  const convenientLength = parseFloat($("#convenient-length-input").val()) || 0;
  const itemWidth = parseFloat($("#floor-width-input").val()) || 0;
  const itemLength = parseFloat($("#floor-length-input").val()) || 0;

  if ([convenientWidth, convenientLength, itemWidth, itemLength].some((v) => v <= 0)) {
    return $("#result").html("Os valores inseridos não pode ser menor ou igual a 0.");
  }

  const convenientArea = convenientWidth * convenientLength;
  const itemArea = (itemWidth / 100) * (itemLength / 100);
  const items = (convenientArea / itemArea).toFixed(0);
  const finalItems = $("#loss-percent-button").is(":checked")
    ? (items * 1.1).toFixed(0)
    : items;

  $("#result").html(
    `Quantidade <strong>aproximada</strong> de peças necessárias ${
      $("#loss-percent-button").is(":checked") ? ", considerando a taxa de perda" : ""
    }: ${finalItems}`
  );
}

function calcularTinta() {
  let convenientArea = parseFloat($("#tint-total-area-input").val()) || 0;
  const openArea = parseFloat($("#tint-total-open-area-input").val()) || 0;
  const totalCoat = parseFloat($("#tint-coat-input").val()) || 0;

  if ($("#unknown-area-button").is(":checked")) {
    const width = parseFloat($("#tint-unk-convenient-width-input").val()) || 0;
    const height = parseFloat($("#tint-unk-convenient-height-input").val()) || 0;
    convenientArea = width * height;
  }

  if ([convenientArea, openArea, totalCoat].some((v) => v <= 0)) {
    return $("#tint-result").html("Os valores não podem ser menor que 0 ou nulos.");
  }

  convenientArea -= openArea;
  const rendimento = type === "selador" ? 0.18 : type === "massa-corrida" ? 0.572 : 0.04;
  let finalValue = convenientArea * rendimento * totalCoat;

  if ($("#tint-loss-percent-button").is(":checked")) {
    finalValue *= 1.1;
  }

  $("#tint-result").html(
    `Quantidade <strong>aproximada</strong> de litros necessários ${
      $("#tint-loss-percent-button").is(":checked") ? ", considerando a taxa de perda" : ""
    }: ${finalValue.toFixed(2)}L`
  );
}

function calcularTelha() {
  const base = parseFloat($("#tile-convenient-width-input").val()) || 0;
  const height = parseFloat($("#tile-convenient-length-input").val()) || 0;
  const unitsPerSquareMeter = parseFloat($("#tiles-type").val()) || 0;

  if ([base, height, unitsPerSquareMeter].some((v) => v <= 0)) {
    return $("#tile-result").html("Os valores não podem ser menor que 0 ou nulos.");
  }

  const roofArea = base * height;
  let tiles = roofArea * unitsPerSquareMeter;

  if ($("#tile-loss-percent-button").is(":checked")) {
    tiles *= 1.1;
  }

  $("#tile-result").html(
    `Quantidade <strong>aproximada</strong> de telhas necessárias ${
      $("#tile-loss-percent-button").is(":checked") ? ", considerando a taxa de perda" : ""
    }: ${tiles.toFixed(0)} telhas.`
  );
      }
