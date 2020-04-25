let ChuteCount = 0;
let InsciumCount = 0;
let CrawlerCount = 0;
let ActTime = 500;
let ResourceTime = 5000
let Idle = true;
let PriceScaling = 2;
let Progress = 0;

document.getElementById("GatherChutes").addEventListener("click", () => {
  Action("Chute");
});

document.getElementById("GatherInscium").addEventListener("click", () => {
  Action("Inscium");
});

document.getElementById("ConstructCrawler").addEventListener("click", () => {
  Action("Crawler");
});

setInterval(AddResources, ResourceTime);

function AddResources() {
  ChuteCount += CrawlerCount;
  InsciumCount += CrawlerCount;
  ValueUpdate(["ChuteCount", "InsciumCount"]);
}

function Action(option) {
  if (Idle) {
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
        let cost = Math.pow(PriceScaling, CrawlerCount);
        if (ChuteCount >= cost && InsciumCount >= cost) {
          CrawlerCount += 1;
          InsciumCount -= cost;
          ChuteCount -= cost;
          ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount"]);
          if (Progress === 1) {
            Progress = 2;
            document.getElementById("ConstructAssembler").hidden = false;
          }
          document.getElementById("ConstructCrawler").title = `Construct a crawler. I'll need ${Math.pow(PriceScaling, CrawlerCount)} inscium and ${Math.pow(PriceScaling, CrawlerCount)} chute. These things will gather inscium and chutes for me.`;
        }
        break;
        case "Assembler":
          let cost = Math.pow(PriceScaling, CrawlerCount);
          if (ChuteCount >= cost && InsciumCount >= cost) {
            CrawlerCount += 1;
            InsciumCount -= cost;
            ChuteCount -= cost;
            ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount"]);
            if (Progress === 1) {
              Progress = 2;
              document.getElementById("ConstructAssembler").hidden = false;
            }
            document.getElementById("ConstructCrawler").title = `Construct a crawler. I'll need ${Math.pow(PriceScaling, CrawlerCount)} inscium and ${Math.pow(PriceScaling, CrawlerCount)} chute. These things will gather inscium and chutes for me.`

        }
        break;
    }
    Idle = false;
    setTimeout( () => {
      Idle = true;
    }, ActTime);
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
    }
    document.getElementById(element).innerHTML = string;
  }
}
