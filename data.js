let ChuteCount = 0;
let InsciumCount = 0;
let CrawlerCount = 0;
let AssemblerCount = 0;
let ActTime = 500;
let ResourceTime = 5000
let Idle = true;
let PriceScaling = 2;
let Progress = 0;

document.getElementById("GatherChutes").addEventListener("click", () => {
  EveryAction("Chute",false);
});

document.getElementById("GatherInscium").addEventListener("click", () => {
  EveryAction("Inscium",false);
});

document.getElementById("ConstructCrawler").addEventListener("click", () => {
  EveryAction("Crawler",false);
});

setInterval(AddResources, ResourceTime);

function AddResources() {
  ChuteCount += CrawlerCount;
  InsciumCount += CrawlerCount;
  ValueUpdate(["ChuteCount", "InsciumCount"]);
  for (AssemblerCount) {
    EvertAction("Crawler",true);
}
}

function EveryAction(option, mach) {
  if (Idle || mach) {
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
          let cost = Math.floor(Math.pow(PriceScaling+0.5, AssemblerCount));
          if (ChuteCount >= cost && InsciumCount >= cost && CrawlerCount >= cost) {
            AssemblerCount += 1;
            CrawlerCount -= cost;
            InsciumCount -= cost;
            ChuteCount -= cost;
            ValueUpdate(["CrawlerCount", "ChuteCount", "InsciumCount", "AssemblerCount"]);
            }
            document.getElementById("ConstructAssembler").title = `Assemble an assembler. I'll need ${Math.pow(PriceScaling, AssemblerCount)} crawlers, ${Math.pow(PriceScaling, AssemblerCount)} chutes, and ${Math.pow(PriceScaling, AssemblerCount)} inscium. These will turn my raw materials into crawlers, assuming I have enough.`

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
      case "AssemblerCount":
        string = "Assemblers: " + AssemblerCount;
        break;
    }
    document.getElementById(element).innerHTML = string;
  }
}
