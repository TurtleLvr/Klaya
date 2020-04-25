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

document.getElementById("GatherChutes").addEventListener("click", () => {
  EveryAction("Chute");
});

document.getElementById("GatherInscium").addEventListener("click", () => {
  EveryAction("Inscium");
});

document.getElementById("ConstructCrawler").addEventListener("click", () => {
  EveryAction("Crawler");
});

document.getElementById("ConstructAssembler").addEventListener("click", () => {
  EveryAction("Assembler");
});

document.getElementById("ConstructDepot").addEventListener("click", () => {
  EveryAction("Depot");
});

document.getElementById("ConstructGarishStatue").addEventListener("click", () => {
  EveryAction("GarishStatue");
});

setInterval(AddResources, ResourceTime);

function AddResources() {
  ChuteCount += CrawlerCount*(DepotCount + 1);
  InsciumCount += CrawlerCount*(DepotCount + 1);
  ValueUpdate(["ChuteCount", "InsciumCount"]);
  let AssemblyLeft = AssemblerCount
  for (;AssemblyLeft > 0;) {
    EveryAction("Crawler")
    AssemblyLeft -= 1
  }
}

function EveryAction(option) {
    switch (option) {
      case "Chute":
        ChuteCount += 1;
        ValueUpdate(["ChuteCount"]);
        if (Progress === 0 && InsciumCount >= 1) {
          Progress = 1;
          document.getElementById("ConstructCrawler").hidden = false;
        }
        break;
      case "Inscium":
        InsciumCount += 1;
        ValueUpdate(["InsciumCount"]);
        if (Progress === 0 && ChuteCount >= 1) {
          Progress = 1;
          document.getElementById("ConstructCrawler").hidden = false;
        }
        break;
      case "Crawler":
        let CostCra = Math.pow(PriceScaling, CrawlerCount);
        if (ChuteCount >= CostCra && InsciumCount >= CostCra) {
          CrawlerCount += 1;
          InsciumCount -= CostCra;
          ChuteCount -= CostCra;
          ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount"]);
          if (Progress === 1) {
            Progress = 2;
            document.getElementById("ConstructAssembler").hidden = false;
          }
          document.getElementById("ConstructCrawler").title = `Construct a crawler. I'll need ${Math.floor(Math.pow(PriceScaling, CrawlerCount))} inscium and ${Math.floor(Math.pow(PriceScaling, CrawlerCount))} chutes. These things will gather inscium and chutes for me.`;
        }
        break;
      case "Assembler":
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
          }
          document.getElementById("ConstructAssembler").title = `Assemble an assembler. I'll need ${Math.floor(Math.pow(PriceScaling*1.25, AssemblerCount))} crawlers, ${Math.floor(Math.pow(PriceScaling*1.25, AssemblerCount))*12} chutes, and ${Math.floor(Math.pow(PriceScaling*1.25, AssemblerCount))*12} inscium. These will turn my raw materials into crawlers, assuming I have enough.`
        break;
      case "Depot":
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
          }
          document.getElementById("ConstructDepot").title = `Construct a depot. I'll need ${Math.floor(Math.pow(PriceScaling*1.5, DepotCount))*2} crawlers, ${Math.floor(Math.pow(PriceScaling*1.5, DepotCount))*35} chutes, and ${Math.floor(Math.pow(PriceScaling*1.5, DepotCount))*7} inscium. Depots ought to act as hubs for crawlers, allowing them to be far more efficient.`
        break;
      case "GarishStatue":
        let CostGar = Math.floor(Math.pow(PriceScaling, GarishStatueCount));
        if (DepotCount >= CostGar*2 && AssemblerCount >= CostGar*2 && CrawlerCount >= CostGar*8 && ChuteCount >= CostGar*50 && InsciumCount >= CostGar*120) {
          GarishStatueCount += 1;
          DepotCount -= CostGar*2;
          AssemblerCount -= CostGar*2;
          CrawlerCount -= CostGar*8;
          InsciumCount -= CostGar*120;
          ChuteCount -= CostGar*50;
          ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount", "AssemblerCount", "DepotCount", "GarishStatueCount"]);
          }
          document.getElementById("ConstructGarishStatue").title = `Construct a garish statue. I'll need ${Math.floor(Math.pow(PriceScaling, GarishStatueCount))*2} depots, ${Math.floor(Math.pow(PriceScaling, GarishStatueCount))*2} assemblers, ${Math.floor(Math.pow(PriceScaling, GarishStatueCount))*8} crawlers, ${Math.floor(Math.pow(PriceScaling, GarishStatueCount))*50} chutes, and ${Math.floor(Math.pow(PriceScaling, GarishStatueCount))*120} inscium. I don't know why I know how to make these, they don't seem to serve any purpose. Not for me, at least.`
      break;

        }
}

function ValueUpdate(id) {
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
