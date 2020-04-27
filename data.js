let ResourceTime = 5000;
let PriceScaling = 2;
let Progress = 0;
let DepotBonus = 1;
let JourneyPriceScaling = 2;

class Item {
  constructor(Count, Costscaling, Name, Tooltip, CostMultiplier, Components, UpgUpdate) {
    this.Count = Count;
    this.Costscaling = Costscaling;
    this.Name = Name;
    this.Tooltip = Tooltip;
    this.CostMultiplier = CostMultiplier;
    this.Components = Components;
    this.UpgUpdate = UpgUpdate;
  }

  get PriceBase() {
    return this.PriceDetermination();
  }

  get CurrentTooltip() {
    return this.CreateTooltip();
  }

  PriceDetermination() {
    return Math.floor(Math.pow(PriceScaling*this.Costscaling, this.Count));
  }

  CreateTooltip() {
    let string = this.Tooltip;

    for (let i = 0; i < this.CostMultiplier.length; i++) {
      string = string.replace(`#${i}`, `${this.PriceBase*this.CostMultiplier[i]}`);
    }

    return string;
  }
}

const Inscium = new Item(0, 0, "Inscium", "Gather some chutes. These plants are everywhere, but they seem quite sturdy.", [], [],false);
const Chute = new Item(0, 0, "Chutes", "Squish some insects. They contain inscium, which is useful for something or other.", [], [],false);
const Crawler = new Item(0, 1, "Crawlers", "Construct a crawler. I'll need #0 inscium and #1 chutes. These things will gather inscium and chutes for me.", [1, 1],[Inscium,Chute]);
const Assembler = new Item(0, 1.25, "Assemblers", "Assemble an assembler. I'll need #0 crawler, #1 chutes, and #2 inscium. These will turn my raw materials into crawlers, assuming I have enough.", [1, 12, 12],[Crawler,Chute,Inscium],false);
const Depot = new Item(0, 1.5, "Depots","Construct a depot. I'll need #0 crawlers, #1 chutes, and #2 inscium. Depots ought to act as hubs for crawlers, allowing them to be far more efficient.", [2, 35, 7],[Crawler,Chute,Inscium],false);
const GarishStatue = new Item(0, 1, "Garish_Statues","Sculpt a garish statue. I'll need #0 depots, #1 assemblers, #2 crawlers, #3 chutes, and #4 inscium. I don't know why I know how to make these, they don't seem to serve any purpose. Not for me, at least.",[2,2,8,50,120],[Depot,Assembler,Crawler,Chute,Inscium],false);

const Exploration = new Item(0, 0, "Exploration","It's time for me to move on, for one reason or another. This place has become so cluttered that I can hardly stand it.",[],[],false);
const Nature = new Item(0, 1, "Nature","This require #0 exploration. On my journies, I have found lands with bountiful flora and fauna. As there is plenty of room, things I build will not increase in cost nearly as quickly.",[1],[Exploration],true);
const Harmony = new Item(0, 1, "Harmony","This require #0 exploration. On my journies, I have found  Each depot will make other depots more efficient, here.",[1],[Exploration],true);
const Haste = new Item(0, 1, "Haste","This require #0 exploration. On my journies, I have found a place with an air of vigor, wherein I feel time itself moving faster. All things but myself will produce faster, here.",[1],[Exploration],true);
const Golem = new Item(0, 1, "Golems","This require #0 exploration. On my journies, I have found another like myself. He will gather materials and help administrate crawlers.",[1],[Exploration],false);

document.getElementById("Chutes_Button").addEventListener("click", () => {ConstructionFunction(Chute);});
document.getElementById("Inscium_Button").addEventListener("click", () => {ConstructionFunction(Inscium);});
document.getElementById("Crawlers_Button").addEventListener("click", () => {ConstructionFunction(Crawler);});
document.getElementById("Assemblers_Button").addEventListener("click", () => {ConstructionFunction(Assembler);});
document.getElementById("Depots_Button").addEventListener("click", () => {ConstructionFunction(Depot);});
document.getElementById("Garish_Statues_Button").addEventListener("click", () =>{ ConstructionFunction(GarishStatue);});

document.getElementById("Exploration_Button").addEventListener("click", () => {Abandon();});

document.getElementById("Nature_Button").addEventListener("click", () => {ConstructionFunction(Nature);});
document.getElementById("Harmony_Button").addEventListener("click", () => {ConstructionFunction(Harmony);});
document.getElementById("Haste_Button").addEventListener("click", () => {ConstructionFunction(Haste);});
document.getElementById("Golems_Button").addEventListener("click", () => {ConstructionFunction(Golem);});


let Income = setInterval(AddResources, ResourceTime);

function AddResources() {
  let GatheringGain = Math.floor(Crawler.Count*(Math.pow(Depot.Count+Golem.Count, DepotBonus) + 1))+(Golem.Count*12);
  Chute.Count += GatheringGain;
  Inscium.Count += GatheringGain;
  ValueUpdate([Chute,Inscium]);
  for (let i = Assembler.Count; i > 0; i--) {
    ConstructionFunction(Crawler);
  }
};

function ProgressQuery() { //This function checks if you have met the requirements to progress and if you have it progresses you.
let Passing = false;
  switch(Progress) {
    case 0:
      if (Chute.Count > 0 && Inscium.Count > 0) {
        document.getElementById("Crawlers_Button").hidden = false;
        Passing = true;
      }
      break;
    case 1:
      if (Crawler.Count > 0) {
        document.getElementById("Assemblers_Button").hidden = false;
        document.getElementById("Depots_Button").hidden = false;
        Passing = true;
      }
      break;
    case 2:
      if (Assembler.Count > 0 && Depot.Count > 0) {
        document.getElementById("Garish_Statues_Button").hidden = false;
        Passing = true;
        }
      break;
    case 3:
      if (GarishStatue.Count > 0) {
        document.getElementById("Exploration_Button").hidden = false;
        Passing = true;
        }
      break;
    case 4:
      if (Exploration.Count > 0) {
        document.getElementById("Nature_Button").hidden = false;
        document.getElementById("Harmony_Button").hidden = false;
        document.getElementById("Haste_Button").hidden = false;
        document.getElementById("Golems_Button").hidden = false;
        Passing = true;
        }
      break;
  }
  if(Passing) {
    Progress += 1;
  }
}

/* Called like: ValueUpdate([Crawler, Chute, ...]); */
function ValueUpdate(objects) {
  let string = "";

  for (object of objects) {
    string = object.Name + ": " + object.Count;
    document.getElementById(object.Name).innerHTML = string;
  }
}

/* Called like: TooltipUpdate([Crawler, Assembler, ...]); */
function TooltipUpdate(objects) {
  for (object of objects) {
    document.getElementById(object.Name + "_Button").title = object.CurrentTooltip;
  }
}

function ConstructionFunction(builtitem) {
  for(object of builtitem.Components) { /* This part of the function checks each component to ensure there is enough. */
    if (object.Count < builtitem.CostMultiplier[builtitem.Components.indexOf(object)]*builtitem.PriceBase) {return};
  }
  for(object of builtitem.Components) { /* This part of the function removes the components used to build each item. */
    object.Count -= builtitem.CostMultiplier[builtitem.Components.indexOf(object)]*builtitem.PriceBase;
  }
  builtitem.Count += 1;
  ValueUpdate(builtitem.Components.concat([builtitem]));
  TooltipUpdate(builtitem.Components.concat([builtitem]));
  ProgressQuery();
  if(builtitem.UpgUpdate){ExplorationUpgradeUpdate()};
}

function Abandon() {
  Exploration.Count += GarishStatue.Count;
  Inscium.Count = 0;
  Chute.Count = 0;
  Crawler.Count = 0;
  Assembler.Count = 0;
  Depot.Count = 0;
  GarishStatue.Count = 0;
  ValueUpdate([Chute,Inscium,Crawler,Assembler,Depot,GarishStatue,Exploration]);
  TooltipUpdate([Chute,Inscium,Crawler,Assembler,Depot,GarishStatue,Nature,Harmony,Haste,Golem]);
  ProgressQuery();
}

function ExplorationUpgradeUpdate() {
  ResourceTime = Math.floor(5000*Math.pow(0.625,Haste.Count));
  PriceScaling = 1+Math.pow(0.9375,Nature.Count);
  DepotBonus = Math.pow(1.125,Harmony.Count);
  clearInterval(Income)
  Income = setInterval(AddResources, ResourceTime)
}

/*
let ResourceTime = 5000;
let PriceScaling = 2;
let Progress = 0;
let DepotBonus = 1;
let JourneyPriceScaling
*/
