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
    this.Count = Count; /*This specifies how many of any given item the player has. It always starts at 0.*/
    this.Costscaling = Costscaling; /*The default is 1, and this should not be below 1. This multiplies the cost scaling.*/
    this.Name = Name; /*This is referenced in respect to the html a lot. It ought to be the plural form of the variable name.*/
    this.Tooltip = Tooltip; /*Self explanitory, but format matters.*/
    this.CostMultiplier = CostMultiplier; /**/
    this.Components = Components; /**/
    this.UpgUpdate = UpgUpdate; /**/
    this.PriceScaleType = PriceScaleType; /**/
  }

  get PriceBase() {
    return this.PriceDetermination();
  }

  get CurrentTooltip() {
    return this.CreateTooltip();
  }

  PriceDetermination() {
    return Math.pow(this.PriceScaleType.ExponentBase*this.Costscaling, this.Count);
  }

  CreateTooltip() {
    let string = this.Tooltip;

    for (let i = 0; i < this.CostMultiplier.length; i++) {
      string = string.replace(`#${i}`, `${Math.floor(this.PriceBase*this.CostMultiplier[i])}`);
    }

    return string;
  }
}

const Zeroth = new PriceScaleSource(1.10);
const First = new PriceScaleSource(2);
const Second = new PriceScaleSource(3);
const Third = new PriceScaleSource(1.5);

const Chute = new Item(0, 0, "Chutes", "Time. A tough building material.", [], [],false,Zeroth);
const Crawler = new Item(1, 1, "Crawlers", "#0 chutes. They find chutes.", [1],[Chute],false,Zeroth);
const Assembler = new Item(0, 1.25, "Assemblers", "#0 crawlers and #1 chutes. They make crawlers.", [1, 12],[Crawler,Chute],false,First);
const Depot = new Item(0, 1.5, "Depots","#0 crawlers and #1 chutes. They multiply crawler production.", [2, 20],[Crawler,Chute],false,First);
const GarishStatue = new Item(0, 1, "Garish_Statues","#0 depots, #1 assemblers, #2 crawlers, and #3 chutes. They give a sense of completion.",[2,2,10,100],[Depot,Assembler,Crawler,Chute],false,First);

const Exploration = new Item(0, 0, "Exploration","All my possessions.",[],[],false,Second);
const Nature = new Item(0, 1, "Nature","#0 exploration. More complex structures do not rise in cost as quickly.",[1],[Exploration],true,Second);
const Harmony = new Item(0, 1, "Harmony","#0 exploration. Each depot will make other depots more efficient.",[1],[Exploration],true,Second);
const Haste = new Item(0, 1, "Haste","#0 exploration. Decreases the amount of time it takes for assemblers and crawlers to work.",[1],[Exploration],true,Second);
const Golem = new Item(0, 1, "Golems","#0 exploration. Acts as an extra depot.",[1],[Exploration],false,Second);

const StrangeBox = new Item(0, 0, "Strange_Boxes","My knowledge. More knowledge means more boxes.",[],[],true,Third);
const Sigil = new Item(0, 0, "Sigils","A box for seven.",[],[],false,Third);
const Shavings = new Item(0, 1, "Shavings","Time.",[],[],false,Third);
const Cleerock = new Item(0, 1, "Cleerock","#0 shavings. Used to build things.",[5],[Shavings],false,Third);
const Field = new Item(0, 1, "Fields","#0 sigil and #1 cleerock. Grows shavings.",[1,1],[Sigil,Cleerock],false,Third);
const Explorer = new Item(0, 2, "Explorers","#0 sigils. Explores automatically.",[5],[Sigil],false,Third);
const Conjuror = new Item(0, 1.5, "Conjurors","#0 sigils and #1 cleerock. Conjurors chutes based from other chutes.",[1,3],[Sigil,Cleerock],false,Third);
const Scribe = new Item(0, 10, "Scribes","#0 sigils and #1 cleerock. Scribes scribe sigils based on knowledge.",[2,5],[Sigil,Cleerock],false,Third);
const Analyzer = new Item(0, 3, "Analyzers","#0 cleerock, #1 sigils, and #2 shavings. Considers reality.",[2,1,20],[Cleerock,Sigil,Shavings],false,Third);

const Insight = new Item(0, 0, "Insights","Time and thought.",[],[],false,Third);

/*I tried to make all these event listeners a single function, but there's some fucky bullshit where it doesn't interact properly with the html if you do that, so I gave up. If only js had pointers. */
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
document.getElementById("Explorers_Button").addEventListener("click", () => {ConstructionFunction(Explorer);});
document.getElementById("Conjurors_Button").addEventListener("click", () => {ConstructionFunction(Conjuror);});
document.getElementById("Scribes_Button").addEventListener("click", () => {ConstructionFunction(Scribe);});
document.getElementById("Analyzers_Button").addEventListener("click", () => {ConstructionFunction(Analyzer);});


let Income = setInterval(AddResources, ResourceTime);
let Crop = setInterval(Harvest, FieldTime);

function AddResources() {
  let GatheringGain = Math.floor(Crawler.Count*(Math.pow(Depot.Count+Golem.Count, DepotBonus) + 1));
  Chute.Count += GatheringGain;
  GatheringGain = Math.floor(Conjuror.Count*Chute.Count*0.5);
  Chute.Count += GatheringGain;
  ValueUpdate([Chute]);
  for (let i = Assembler.Count; i > 0; i--) {
    ConstructionFunction(Crawler);
  };
};

function Harvest() {
  Shavings.Count += Field.Count;
  Chute.Count += Math.round(Math.pow(Chute.Count,0.5))
  Insight.Count += Analyzer.Count
  Exploration.Count += GarishStatue.Count*Explorer.Count
  Sigil.Count += Math.floor(Scribe.Count*(Haste.Count + Nature.Count + Harmony.Count + Golem.Count)/2)
  ValueUpdate([Chute,Shavings,Insight,Exploration]);
};

function ProgressQuery() { //This function checks if you have met the requirements to progress and if you have it progresses you. I don't believe there is a way to simplify the switch cases.
let Passing = false;
  switch(Progress) {
    case 0:
      if (Crawler.Count > 1) {
        document.getElementById("Assemblers_Button").hidden = false;
        document.getElementById("Depots_Button").hidden = false;
        ValueUpdate([Assembler,Depot]);
        Passing = true;
      };
      break;
    case 1:
      if (Assembler.Count > 0 && Depot.Count > 0) {
        document.getElementById("Garish_Statues_Button").hidden = false;
        ValueUpdate([GarishStatue]);
        Passing = true;
      };
      break;
    case 2:
      if (GarishStatue.Count > 0) {
        document.getElementById("Exploration_Button").hidden = false;
        document.getElementById("Exploration").hidden = false;
        ValueUpdate([Exploration]);
        Passing = true;
      };
      break;
    case 3:
      if (Exploration.Count > 0) {
        document.getElementById("Nature_Button").hidden = false;
        document.getElementById("Harmony_Button").hidden = false;
        document.getElementById("Haste_Button").hidden = false;
        document.getElementById("Golems_Button").hidden = false;
        ValueUpdate([Nature,Harmony,Haste,Golem]);
        Passing = true;
      };
      break;
    case 4:
      if (Haste.Count + Nature.Count + Harmony.Count + Golem.Count > 3) {
        document.getElementById("Strange_Boxes_Button").hidden = false;
        ValueUpdate([StrangeBox]);
        Passing = true;
      };
      break;
    case 5:
      if (StrangeBox.Count > 0) {
        document.getElementById("Disassemble_Button").hidden = false;
        ValueUpdate([StrangeBox]);
        Passing = true;
      };
      break;
    case 6:
      if (Sigil.Count > 0) {
        document.getElementById("Sigils").hidden = false;
        document.getElementById("Cleerock_Button").hidden = false;
        document.getElementById("Fields_Button").hidden = false;
        ValueUpdate([Cleerock,Field]);
        Passing = true;
      };
      break;
    case 7:
      if (Field.Count > 0) {
        document.getElementById("Shavings").hidden = false;
        document.getElementById("Explorers_Button").hidden = false;
        ValueUpdate([Shavings,Explorer]);
        Passing = true;
      };
      break;
    case 8:
      if (Explorer.Count > 0) {
        Exploration.Tooltip = "Time and Statues."
        document.getElementById("Conjurors_Button").hidden = false;
        document.getElementById("Scribes_Button").hidden = false;
        document.getElementById("Analyzers_Button").hidden = false;
        document.getElementById("Exploration_Button").hidden = true;
        ValueUpdate([Exploration,Conjuror,Scribe,Analyzer])
        Passing = true;
      };
      break;
    case 9:
      if (Scribe.Count > 0) {
        document.getElementById("Strange_Boxes_Button").hidden = true;
        document.getElementById("Strange_Boxes").hidden = true;
        document.getElementById("Disassemble_Button").hidden = true;
        for(let i = StrangeBox.Count; i > 0; i--) {Disassembly()};
        Sigil.Tooltip = "Knowledge and scribes."
        ValueUpdate([Sigil])
        Passing = true;
      };
      break;
    case 10:
      if (Analyzer.Count > 0) {
        document.getElementById("Insights").hidden = false;
        ValueUpdate([Insight])
        Passing = true;
      };
      break;
};
  if(Passing) {
    Progress += 1;
  }
};

/* Called like: ValueUpdate([Crawler, Chute, ...]); */
function ValueUpdate(objects) {
  let string = "";

  for (object of objects) {
    string = object.Name + ": " + object.Count + ". Cost: " + object.CurrentTooltip;
    document.getElementById(object.Name).innerHTML = string;
  };
};


function ConstructionFunction(builtitem) {
  for(object of builtitem.Components) { /* This part of the function checks each component to ensure there is enough, and stops the function if there is not. */
    if (object.Count < Math.floor(builtitem.CostMultiplier[builtitem.Components.indexOf(object)]*builtitem.PriceBase)) {return};
  };
  for(object of builtitem.Components) { /* This part of the function removes the components used to build each item. */
    object.Count -= Math.floor(builtitem.CostMultiplier[builtitem.Components.indexOf(object)]*builtitem.PriceBase);
  };
  builtitem.Count += 1;
  ValueUpdate(builtitem.Components.concat([builtitem]));
  ProgressQuery();
  if(builtitem.UpgUpdate){ExplorationUpgradeUpdate()};
};

function Abandon() {
  Exploration.Count += GarishStatue.Count;
  Chute.Count = 0;
  Crawler.Count = 1;
  Assembler.Count = 0;
  Depot.Count = 0;
  GarishStatue.Count = 0;
  ValueUpdate([Chute,Crawler,Assembler,Depot,GarishStatue,Exploration]);
  ProgressQuery();
};

function ExplorationUpgradeUpdate() {
  ResourceTime = Math.floor(5000*Math.pow(0.625,Haste.Count));
  First.ExponentBase= 1+Math.pow(0.9375,Nature.Count);
  DepotBonus = Math.pow(1.0625,Harmony.Count);
  clearInterval(Income);
  Income = setInterval(AddResources, ResourceTime);
  ValueUpdate([Chute,Crawler,Assembler,Depot,GarishStatue]);
};

function Disassembly() {
  if (StrangeBox.Count < 1) {return};
  StrangeBox.Count -= 1;
  Sigil.Count += 7;
  Cleerock.Count += 1;
  ValueUpdate([Sigil,Cleerock,StrangeBox]);
  ProgressQuery();
};

function CastSelfIntoDesert() {
  Abandon();
  StrangeBox.Count += Math.floor((Haste.Count + Nature.Count + Harmony.Count + Golem.Count)/4);
  Golem.Count = 0;
  Harmony.Count = 0;
  Nature.Count = 0;
  Haste.Count = 0;
  Exploration.Count = 0;
  ExplorationUpgradeUpdate();
  ValueUpdate([Haste,Exploration,Nature,Harmony,Golem,StrangeBox]);
  ProgressQuery();
};

ValueUpdate([Chute,Crawler]);
