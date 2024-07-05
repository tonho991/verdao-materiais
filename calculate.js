$("#modal").modal("show");

$("#btn-calc").on("click", () => {
  calculate();
});

function calculate() {
  let convenientWidth = parseFloat($("#convenient-width-input").val());
  let convenientLength = parseFloat($("#convenient-length-input").val());
  let lossPercent = parseInt($("#loss-rate-input").val());

  let itemArea = (120 / 100) * (60 / 100);
  let convenientArea = (convenientWidth) * (convenientLength);

  let items = (convenientArea / itemArea).toFixed(0);

  let finalItems = lossPercent <= 0 ? items : (items * (1 + (lossPercent / 100))).toFixed(0);

  $("#result").html(`Quantidade de peças necessárias ${lossPercent <= 0 ? "" : ", considerando a taxa de perca"}: ${finalItems}`)
}
