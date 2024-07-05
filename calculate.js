 $("#modal-tinta").modal("show")

$("#btn-calc").on("click", () => {
  calculate();
});

$("#tint-btn-calc").on("click", ()=> {
  calcularTinta();
});

$("#unknow-area-button").change(function() {
  if($(this).is(":checked")){
    $("#tint-convenient-width-box").css("display", "block");
    $("#tint-convenient-height-box").css("display", "block");
    $("#tint-convenient-area").css("display", "none")
  } else {
    $("#tint-convenient-width-box").css("display", "none");
    $("#tint-convenient-height-box").css("display", "none");
    $("#tint-convenient-area").css("display", "block")
  }
});

function calculate() {
  let convenientWidth = parseFloat($("#convenient-width-input").val());
  let convenientLength = parseFloat($("#convenient-length-input").val());
  let lossPercent = $("#loss-percent-button").is(":checked") ? 10 : 0;

  //exemplo de piso 120x60

  let itemArea = (100 / 100) * (100 / 100);
  let convenientArea = (convenientWidth) * (convenientLength);

  let items = (convenientArea / itemArea).toFixed(0);

  let finalItems = lossPercent = 0 ? items : (items * (1 + (lossPercent / 100))).toFixed(0);

  $("#result").html(`Quantidade de peças necessárias ${lossPercent <= 0 ? "" : ", considerando a taxa de perca"}: ${finalItems}`)
}

function calcularTinta(){
  let convenientArea = parseFloat($("#total-area-input").val());
  let openArea = parseFloat($("#tint-total-open-area-input").val());
  let totalCoat = parseFloat($("#tint-coat-input").val());
  let lossPercent = $("#tint-loss-percent-button").is(":checked") ? 10 : 0;

  if($("#unknow-area-button").is(":checked")){
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

  const rendimento =  0.180;

  let finalValue = convenientArea * rendimento;

  finalValue = finalValue * totalCoat;


  finalValue = lossPercent == 0 ? finalValue.toFixed(2) : (finalValue * (1 + (lossPercent / 100))).toFixed(2);

  $("#tint-result").html(`Quantidade de litros necessárias${lossPercent == 0 ? "" : ", considerando a taxa de perca"} : ${finalValue}`)

}