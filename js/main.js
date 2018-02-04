var withholder = new Withholder();

$('#TaxableIncomeInput').on('input', function () {
    window.taxableIncome = stripwhitecommas($(this).val());
    window.FY = stripwhitecommas($('#FinancialYearInput').val());
    calculate();
});
$('#FinancialYearInput').on('input', function () {
    window.FY = stripwhitecommas($(this).val());
    calculate();
});
$('#settingsModal').on('hidden.bs.modal', function () {
    calculate();
});

function checkSettings() {
  window.settings.threshold = document.getElementById("threshold").checked
  window.settings.hecs = document.getElementById("hecs").checked
}

function ChangeTime(periods) {
  console.log(periods);
  window.periods = periods;
}

function calculate() {
  checkSettings();
  $("#TaxableIncomeOutput").html(moneyNumber(window.taxableIncome));
  var withholding = withholder.calculateTaxWithholding(window.taxableIncome,window.periods, window.FY, window.settings);

  $("#WithholdingVal").html(moneyNumber(withholding));
  
}

function stripwhitecommas(str) {
  if (!str || 0 === str.length) {
    return str
  } else {
    return str.toString().replace(/[\s,]+/g,'').trim()
  }
}

function moneyNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatcomma(element) {
  return element.toString().replace(/ /g,'').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function main() {
  window.now = moment();
  window.settings = {};
  //if (window.now.month() < 6) {
    //window.now.set('year', now.year() -1);
  //}
  window.now.set('month', 5);
  window.now.set('date', 30);
  window.endFY = moment(window.now);
  window.startFY = moment(window.now.subtract(1, 'years').add(1,'days'));
  $("#FinancialYearInput").val(window.endFY.format("YYYY"));
  $("#FinancialYearInput").attr({"max": window.endFY.format("YYYY")});

	var btnContainer = document.getElementById("selectPeriod");
	var btns = btnContainer.getElementsByClassName("btn");
	for (var i = 0; i < btns.length; i++) {
		btns[i].addEventListener("click", function() {
			var current = document.getElementsByClassName("active");
			current[0].className = current[0].className.replace(" active", "");
			this.className += " active";
			calculate();
		});
	} 

  window.taxableIncome = 50000;
  window.periods = 1;
  window.FY = 2018;
  calculate();
}
main();
