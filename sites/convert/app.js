const UNITS = {
  length: {
    m: { label: "米 (m)", factor: 1 },
    km: { label: "千米 (km)", factor: 1000 },
    cm: { label: "厘米 (cm)", factor: 0.01 },
    mm: { label: "毫米 (mm)", factor: 0.001 },
    mile: { label: "英里 (mile)", factor: 1609.344 },
    ft: { label: "英尺 (ft)", factor: 0.3048 },
    in: { label: "英寸 (in)", factor: 0.0254 },
  },
  weight: {
    kg: { label: "千克 (kg)", factor: 1 },
    g: { label: "克 (g)", factor: 0.001 },
    t: { label: "吨 (t)", factor: 1000 },
    lb: { label: "磅 (lb)", factor: 0.45359237 },
    oz: { label: "盎司 (oz)", factor: 0.028349523125 },
  },
};

const tabs = document.querySelectorAll(".tab");
const fromValue = document.getElementById("from-value");
const toValue = document.getElementById("to-value");
const fromUnit = document.getElementById("from-unit");
const toUnit = document.getElementById("to-unit");
const formula = document.getElementById("formula");

let category = "length";

function populateUnits() {
  const units = UNITS[category];
  const keys = Object.keys(units);
  const build = (select, selectedIndex) => {
    select.innerHTML = "";
    keys.forEach((key, i) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = units[key].label;
      if (i === selectedIndex) opt.selected = true;
      select.appendChild(opt);
    });
  };
  build(fromUnit, 0);
  build(toUnit, Math.min(1, keys.length - 1));
}

function formatNumber(n) {
  if (!isFinite(n)) return "";
  const rounded = Math.round(n * 1e10) / 1e10;
  return rounded;
}

function convert() {
  const units = UNITS[category];
  const value = parseFloat(fromValue.value);
  if (isNaN(value)) {
    toValue.value = "";
    formula.textContent = "";
    return;
  }
  const from = units[fromUnit.value];
  const to = units[toUnit.value];
  const result = (value * from.factor) / to.factor;
  toValue.value = formatNumber(result);
  formula.textContent = `${value} ${fromUnit.value} = ${formatNumber(result)} ${toUnit.value}`;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    category = tab.dataset.category;
    populateUnits();
    convert();
  });
});

fromValue.addEventListener("input", convert);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);

populateUnits();
convert();
