let ResourceTime = 5000;
let Progress = 0;
let DepotBonus = 1;
let FieldTime = 30000;

class PriceScaleSource {
  constructor(ExponentBase) {
    this.ExponentBase = ExponentBase;
  }

}

class Item {
  constructor(Count, Costscaling, Name, Tooltip, CostMultiplier, Components, UpgUpdate,PriceScaleType) {
    this.Count = Count;
    this.Costscaling = Costscaling;
    this.Name = Name;
    this.Tooltip = Tooltip;
    this.CostMultiplier = CostMultiplier;
    this.Components = Components;
    this.UpgUpdate = UpgUpdate;
    this.PriceScaleType = PriceScaleType;
  }

  get PriceBase() {
    return this.PriceDetermination();
  }

  get CurrentTooltip() {
    return this.CreateTooltip();
  }

  PriceDetermination() {
    return Math.floor(Math.pow(this.PriceScaleType.ExponentBase*this.Costscaling, this.Count));
  }

  CreateTooltip() {
    let string = this.Tooltip;

    for (let i = 0; i < this.CostMultiplier.length; i++) {
      string = string.replace(`#${i}`, `${this.PriceBase*this.CostMultiplier[i]}`);
    }

    return string;
  }
}

const First = new PriceScaleSource(2)
const Second = new PriceScaleSource(3)
const Third = new PriceScaleSource(1.5)

const Inscium = new Item(0, 0, "Inscium", "Squish some insects. They contain inscium, which is useful for something or other.", [], [],false,First);
const Chute = new Item(0, 0, "Chutes", "Gather some chutes. These plants are everywhere, but they seem quite sturdy.", [], [],false,First);
const Crawler = new Item(0, 1, "Crawlers", "Construct a crawler. I'll need #0 inscium and #1 chutes. These things will gather inscium and chutes for me.", [1, 1],[Inscium,Chute],false,First);
const Assembler = new Item(0, 1.25, "Assemblers", "Assemble an assembler. I'll need #0 crawler, #1 chutes, and #2 inscium. These will turn my raw materials into crawlers, assuming I have enough.", [1, 12, 12],[Crawler,Chute,Inscium],false,First);
const Depot = new Item(0, 1.5, "Depots","Construct a depot. I'll need #0 crawlers, #1 chutes, and #2 inscium. Depots ought to act as hubs for crawlers, allowing them to be far more efficient.", [2, 35, 7],[Crawler,Chute,Inscium],false,First);
const GarishStatue = new Item(0, 1, "Garish_Statues","Sculpt a garish statue. I'll need #0 depots, #1 assemblers, #2 crawlers, #3 chutes, and #4 inscium. I don't know why I know how to make these, they don't seem to serve any purpose. Not for me, at least.",[2,2,8,50,120],[Depot,Assembler,Crawler,Chute,Inscium],false,First);

const Exploration = new Item(0, 0, "Exploration","It's time for me to move on, for one reason or another. This place has become so cluttered that I can hardly stand it.",[],[],false,Second);
const Nature = new Item(0, 1, "Nature","This require #0 exploration. On my journies, I have found lands with bountiful flora and fauna. As there is plenty of room, things I build will not increase in cost nearly as quickly.",[1],[Exploration],true,Second);
const Harmony = new Item(0, 1, "Harmony","This require #0 exploration. On my journies, I have found  Each depot will make other depots more efficient, here.",[1],[Exploration],true,Second);
const Haste = new Item(0, 1, "Haste","This require #0 exploration. On my journies, I have found a place with an air of vigor, wherein I feel time itself moving faster. All things but myself will produce faster, here.",[1],[Exploration],true,Second);
const Golem = new Item(0, 1, "Golems","This require #0 exploration. On my journies, I have found another like myself. He will gather materials and help administrate crawlers.",[1],[Exploration],false,Second);

const StrangeBox = new Item(0, 0, "Strange_Boxes","On my travels, I have found an endless sea of a material which resembles my flesh. Upon dipping my foot in, I sink slightly. I shall meet my fears and become one with the desert.",[],[],true,Third);
const Sigil = new Item(0, 0, "Sigils","",[],[],false,Third);
const Shavings = new Item(0, 1, "Shavings","",[],[],false,Third);
const Cleerock = new Item(0, 1, "Cleerock","Integrate #0 shavings together to make some Cleerock.",[5],[Shavings],false,Third);
const Field = new Item(0, 1, "Fields","Plant a field of cleerock. This will require #0 sigil and #1 cleerock. This field will yield shavings after a time.",[1,1],[Sigil,Cleerock],false,Third);
const Conjuror = new Item(0, 1.5, "Conjurors","Assemble a conjuror. I'll need #0 sigil and #1 cleerock. These will produce additional chutes and inscium based on how many I already have.",[1,3],[Sigil,Cleerock],false,Third);
const Manufacturer = new Item(0, 10, "Manufacturers","Assemble a manufacturer. I'll need #0 sigils and #1 cleerock. These will build depots and assemblers for me.",[2,5],[Sigil,Cleerock],false,Third);
const Analyzer = new Item(0, 3, "Analyzers","Assemble an analyzer. I'll need #0 cleerock, #1 sigils, and #2 shavings. These will think for me, producing knowledge.",[2,1,20],[Cleerock,Sigil,Shavings],false,Third);

const Insight = new Item(0, 0, "Insights","",[],[],false,Third);


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

document.getElementById("Strange_Boxes_Button").addEventListener("click", () => {CastSelfIntoDesert();});

document.getElementById("Disassemble_Button").addEventListener("click", () => {Disassembly();});
document.getElementById("Cleerock_Button").addEventListener("click", () => {ConstructionFunction(Cleerock);});

document.getElementById("Fields_Button").addEventListener("click", () => {ConstructionFunction(Field);});
document.getElementById("Conjurors_Button").addEventListener("click", () => {ConstructionFunction(Conjuror);});
document.getElementById("Manufacturers_Button").addEventListener("click", () => {ConstructionFunction(Manufacturer);});
document.getElementById("Analyzers_Button").addEventListener("click", () => {ConstructionFunction(Analyzer);});


let Income = setInterval(AddResources, ResourceTime);
let Crop = setInterval(Harvest, FieldTime);

function AddResources() {
  let GatheringGain = Math.floor(Crawler.Count*(Math.pow(Depot.Count+Golem.Count, DepotBonus) + 1))+(Golem.Count*12);
  Chute.Count += GatheringGain;
  Inscium.Count += GatheringGain;
  ValueUpdate([Chute,Inscium]);
  for (let i = Assembler.Count; i > 0; i--) {
    ConstructionFunction(Crawler);
  }
  for (let i = Manufacturer.Count; i > 0; i--) {
    ConsturctionFunction(Depot);
    ConsturctionFunction(Assembler);
  }
};

function Harvest() {
  Shavings.Count += Field.Count;
  Chute.Count += Math.round(Chute.Count*Conjuror.Count/100)
  Inscium.Count += Math.round(Inscium.Count*Conjuror.Count/100)
  Insight.Count += Analyzer.Count
  ValueUpdate([Chute,Inscium,Shavings,Insight]);
}

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
    case 5:
      if (Haste.Count + Nature.Count + Harmony.Count + Golem.Count > 3) {
        document.getElementById("Strange_Boxes_Button").hidden = false;
        Passing = true;
        }
      break;
    case 6:
      if (StrangeBox.Count > 0) {
        document.getElementById("Disassemble_Button").hidden = false;
        Passing = true;
        }
      break;
    case 7:
      if (Sigil.Count > 0) {
        document.getElementById("Cleerock_Button").hidden = false;
        document.getElementById("Fields_Button").hidden = false;
        Passing = true;
        }
      break;
    case 8:
      if (Field.Count > 0) {
        document.getElementById("Shavings").hidden = false;
        document.getElementById("Conjurors_Button").hidden = false;
        document.getElementById("Manufacturers_Button").hidden = false;
        document.getElementById("Analyzers_Button").hidden = false;
        Passing = true;
        }
      break;
    case 9:
      if (Analyzer.Count > 0) {
        document.getElementById("Insights").hidden = false;
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
  for(object of builtitem.Components) { /* This part of the function checks each component to ensure there is enough, and stops the function if there is not. */
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
  First.ExponentBase= 1+Math.pow(0.9375,Nature.Count);
  DepotBonus = Math.pow(1.0625,Harmony.Count);
  clearInterval(Income)
  Income = setInterval(AddResources, ResourceTime)
}

function Disassembly() {
  if (StrangeBox.Count < 1) {return}
  StrangeBox.Count -= 1
  Sigil.Count += 7
  Cleerock.Count += 1
  ValueUpdate([Sigil,Cleerock,StrangeBox]);
  ProgressQuery();
}

function CastSelfIntoDesert() {
  Abandon()
  StrangeBox.Count += Math.floor((Haste.Count + Nature.Count + Harmony.Count + Golem.Count)/4);
  Golem.Count = 0
  Harmony.Count = 0
  Nature.Count = 0
  Haste.Count = 0
  Exploration.Count = 0
  ExplorationUpgradeUpdate()
  ValueUpdate([Haste,Exploration,Nature,Harmony,Golem]);
  TooltipUpdate([Haste,Exploration,Nature,Harmony,Golem]);
  ProgressQuery();
}
