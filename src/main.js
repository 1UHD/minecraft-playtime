const calculate_button = document.getElementById("calculate");

const consoleDiv = document.getElementById("console_div");

const previewDiv = document.getElementById("preview");
const profilePresetsButton = document.getElementById("presets");
const profileName = document.getElementById("profilename");
const profilePath = document.getElementById("profilepath");
const profileButton = document.getElementById("newprofile");
const profilePreset = document.querySelector(".profile");
const grid = document.getElementById("profiles");

const presets = document.querySelector(".presets_chooser");
const presetsBackButton = document.getElementById("presets_back_button");

let colCount = 1;

function html_log(message) {
  consoleDiv.innerHTML += message + "<br>";
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

calculate_button.addEventListener("click", () => {
  try {
    html_log(read_log_file("Damn"));
  } catch(error) {
    html_log(error);
  }
});

profileButton.addEventListener("click", () => {

  if(!profileName.value || !profilePath.value) {
    return;
  }

  html_log(`Profile name: ${profileName.value}`);
  html_log(`Profile path: ${profilePath.value}`);

  previewDiv.parentNode.removeChild(previewDiv);

  let new_div = document.createElement("div");
  new_div.classList.add("profile");
  grid.appendChild(new_div);
  
  new_div.class = profileName.value;
  new_div.id = profileName.value;
  
  let new_div_p = document.createElement("p");
  new_div_p.textContent = profileName.value;
  new_div.appendChild(new_div_p);

  profileName.value = "";
  profilePath.value = "";

  grid.appendChild(previewDiv);

});

profilePresetsButton.addEventListener("click", () => {
  presets.style.visibility = "visible";
  previewDiv.style.visibility = "hidden";
});

presetsBackButton.addEventListener("click", () => {
  presets.style.visibility = "hidden";
  previewDiv.style.visibility = "visible";
})