let ChuteCount = 0;
let InsciumCount = 0;
let CrawlerCount = 0;
let AssemblerCount = 0;
let DepotCount = 0;
let GarishStatueCount = 0;
let ActTime = 500;
let ResourceTime = 5000;
let PriceScaling = 2;
let Progress = 0;
let DepotBonus = 1;

MassClickListener(["GatherChutes","GatherInscium","ConstructCrawler","ConstructAssembler","ConstructDepot","ConstructGarishStatue"])

function MassClickListener(id) { //This function adds all of the event listeners at the start of the function.
  for (element of id) {
    document.getElementById(element).addEventListener("click", (listener) => {
      EveryAction(listener.srcElement.id);
    });
  }
}

setInterval(AddResources, ResourceTime);

function AddResources() {
  let GatheringGain = Math.floor(CrawlerCount*(Math.pow(DepotCount, DepotBonus) + 1));
  ChuteCount += GatheringGain;
  InsciumCount += GatheringGain;
  ValueUpdate(["ChuteCount", "InsciumCount"]);
  let AssemblyLeft = AssemblerCount
  for (;AssemblyLeft > 0;) {
    EveryAction("ConstructCrawler")
    AssemblyLeft -= 1
  }
}

function EveryAction(option) {
    switch (option) {
      case "GatherChutes":
        ChuteCount += 1;
        ValueUpdate(["ChuteCount"]);
        if (Progress === 0 && InsciumCount >= 1) {
          Progress = 1;
          document.getElementById("ConstructCrawler").hidden = false;
        }
        break;
      case "GatherInscium":
        InsciumCount += 1;
        ValueUpdate(["InsciumCount"]);
        if (Progress === 0 && ChuteCount >= 1) {
          Progress = 1;
          document.getElementById("ConstructCrawler").hidden = false;
        }
        break;
      case "ConstructCrawler":
        let CostCra = Math.pow(PriceScaling, CrawlerCount);
        if (ChuteCount >= CostCra && InsciumCount >= CostCra) {
          CrawlerCount += 1;
          InsciumCount -= CostCra;
          ChuteCount -= CostCra;
          ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount"]);
          TooltipUpdate(["ConstructCrawler"]);
          if (Progress === 1) {
            Progress = 2;
            document.getElementById("ConstructAssembler").hidden = false;
          }
        }
        break;
      case "ConstructAssembler":
        let CostAss = Math.floor(Math.pow(PriceScaling*1.25, AssemblerCount));
        if (ChuteCount >= CostAss*12 && InsciumCount >= CostAss*12 && CrawlerCount >= CostAss) {
          AssemblerCount += 1;
          CrawlerCount -= CostAss;
          InsciumCount -= CostAss*12;
          ChuteCount -= CostAss*12;
          if (Progress === 2) {
            Progress = 3;
            document.getElementById("ConstructDepot").hidden = false;
          }
          ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount", "AssemblerCount"]);
          TooltipUpdate(["ConstructCrawler", "ConstructAssembler"]);
          }
        break;
      case "ConstructDepot":
        let CostDep = Math.floor(Math.pow(PriceScaling*1.5, DepotCount));
        if (ChuteCount >= CostDep*35 && InsciumCount >= CostDep*7 && CrawlerCount >= CostDep*2) {
          DepotCount += 1;
          CrawlerCount -= CostDep*2;
          InsciumCount -= CostDep*7;
          ChuteCount -= CostDep*35;
          if (Progress === 3) {
            Progress = 4;
            document.getElementById("ConstructGarishStatue").hidden = false;
          }
          ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount", "DepotCount"]);
          TooltipUpdate(["ConstructCrawler", "ConstructDepot",]);
          }
        break;
      case "ConstructGarishStatue":
        let CostGar = Math.floor(Math.pow(PriceScaling, GarishStatueCount));
        if (DepotCount >= CostGar*2 && AssemblerCount >= CostGar*2 && CrawlerCount >= CostGar*8 && ChuteCount >= CostGar*50 && InsciumCount >= CostGar*120) {
          GarishStatueCount += 1;
          DepotCount -= CostGar*2;
          AssemblerCount -= CostGar*2;
          CrawlerCount -= CostGar*8;
          InsciumCount -= CostGar*120;
          ChuteCount -= CostGar*50;
          ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount", "AssemblerCount", "DepotCount", "GarishStatueCount"]);
          TooltipUpdate(["ConstructCrawler", "ConstructAssembler", "ConstructDepot", "ConstructGarishStatue"]);
          }
      break;
        }
}

function ValueUpdate(id) { //This function updates values.
  let string = "";

  for (element of id) {
    switch(element) {
      case "ChuteCount":
        string = "Chutes: " + ChuteCount;
        break;
      case "InsciumCount":
        string = "Inscium: " + InsciumCount;
        break;
      case "CrawlerCount":
        string = "Crawlers: " + CrawlerCount;
        break;
      case "AssemblerCount":
        string = "Assemblers: " + AssemblerCount;
        break;
      case "DepotCount":
        string = "Depots: " + DepotCount;
        break;
      case "GarishStatueCount":
        string = "Garish Statues: " + GarishStatueCount;
        break;
    }
    document.getElementById(element).innerHTML = string;
  }
}

function TooltipUpdate(id) { //This function updates tooltips.
let string = "";
let BaseCost = 0;
for (element of id) {
  switch(element) {
    case "ConstructCrawler":
      BaseCost = Math.floor(Math.pow(PriceScaling, CrawlerCount));
      string = `Construct a crawler. I'll need ${BaseCost} inscium and ${BaseCost} chutes. These things will gather inscium and chutes for me.`
      break;
    case "ConstructAssembler":
      BaseCost = Math.floor(Math.pow(PriceScaling*1.25, AssemblerCount));
      string = `Assemble an assembler. I'll need ${BaseCost} crawlers, ${BaseCost*12} chutes, and ${BaseCost*12} inscium. These will turn my raw materials into crawlers, assuming I have enough.`
      break;
    case "ConstructDepot":
      BaseCost = Math.floor(Math.pow(PriceScaling*1.5, DepotCount));
      string = `Construct a depot. I'll need ${BaseCost*2} crawlers, ${BaseCost*35} chutes, and ${BaseCost*7} inscium. Depots ought to act as hubs for crawlers, allowing them to be far more efficient.`
      break;
    case "ConstructGarishStatue":
      BaseCost = Math.floor(Math.pow(PriceScaling, GarishStatueCount));
      string = `Construct a garish statue. I'll need ${BaseCost*2} depots, ${BaseCost*2} assemblers, ${BaseCost*8} crawlers, ${BaseCost*50} chutes, and ${BaseCost*120} inscium. I don't know why I know how to make these, they don't seem to serve any purpose. Not for me, at least.`
      break;
    }
    document.getElementById(element).title = string;
  }
}
