let ChuteCount = 0;
let InsciumCount = 0;
let CrawlerCount = 0;
let AssemblerCount = 0;
let ActTime = 500;
let ResourceTime = 5000
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

setInterval(AddResources, ResourceTime);

function AddResources() {
  ChuteCount += CrawlerCount;
  InsciumCount += CrawlerCount;
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
          document.getElementById("ConstructCrawler").title = `Construct a crawler. I'll need ${Math.pow(PriceScaling, CrawlerCount)} inscium and ${Math.pow(PriceScaling, CrawlerCount)} chutes. These things will gather inscium and chutes for me.`;
        }
        break;
      case "Assembler":
          let CostAss = Math.floor(Math.pow(PriceScaling+0.5, AssemblerCount));
          if (ChuteCount >= CostAss && InsciumCount >= CostAss && CrawlerCount >= CostAss) {
            AssemblerCount += 1;
            CrawlerCount -= CostAss;
            InsciumCount -= CostAss;
            ChuteCount -= CostAss;
            ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount", "AssemblerCount"]);
            }
            document.getElementById("ConstructAssembler").title = `Assemble an assembler. I'll need ${Math.floor(Math.pow(PriceScaling+0.5, AssemblerCount))} crawlers, ${Math.floor(Math.pow(PriceScaling+0.5, AssemblerCount))} chutes, and ${Math.floor(Math.pow(PriceScaling+0.5, AssemblerCount))} inscium. These will turn my raw materials into crawlers, assuming I have enough.`
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
    }
    document.getElementById(element).innerHTML = string;
  }
}
