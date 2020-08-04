const pokemonDiv = document.getElementById("results");
const searchButton = document.getElementById("searchButon");
const searchInput = document.getElementById("search");


async function searchPokemon(){
  let pokemonId = document.getElementById("search").value;
  try{
    const { data } = await axios.get(`http://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    document.getElementById("search").value ="";
    makeDiv(data.name, data.height, data.weight, data.sprites.front_default, data.sprites.back_default, data.types);
  } catch(error) {
    document.getElementById("search").value = "";
    pokemonDiv.innerHTML="pokemon not found";
    return;
  }
};

async function addPokemonNames(){
  document.getElementById(this.id).removeEventListener("click", addPokemonNames);
  document.getElementById(this.id).addEventListener("click", removePokemonNames);
  let el = document.getElementById(this.id);
  let lst = document.createElement("ol");
  const data = await fetch(`http://pokeapi.co/api/v2/type/${this.id}`, {method:"GET"}).then(response => response.json());
  for (let name of data.pokemon){
    let pokemon = document.createElement("li");
    pokemon.setAttribute("id", name.pokemon.name);
    pokemon.innerText = name.pokemon.name;
    pokemon.addEventListener("click", getPokemonByName);
    lst.appendChild(pokemon);
  }
  el.appendChild(lst); 
}

function removePokemonNames(){
  document.getElementById(this.id).children[0].remove();
  document.getElementById(this.id).removeEventListener("click", removePokemonNames);
  document.getElementById(this.id).addEventListener("click", addPokemonNames);
}

function getPokemonByName(){
  document.getElementById("search").value = this.id;
  searchPokemon();
}

function makeDiv (name, height, weight, picture, back_pic, types){
  let typeArr = [];
  for (let type of types){
    typeArr.push(type.type.name);
  }
  let typesList = typeArr.join("</li><li> ");
  let picText;
  if (back_pic !== null){
    if (picture !==null){
      picText = `<div>picture: <br> <img src="${picture}" onmouseover="this.src='${back_pic}';" onmouseout="this.src='${picture}';"/></div>`;
    } else {
      picText = `<div>picture: <br> <img src="${back_pic}"></div>`;
    }
  } else {
    if (picture !==null){
      picText = `<div>picture: <br> <img src="${picture}"></div>`;
    } else {
      picText = '';
    }
  }
  const htmlText = `
    <div class="pokemonContainer">
      <div>Name: ${name}</div>
      <div>height: ${height}</div>
      <div>weight: ${weight}</div>
      ${picText}
      <div id="types"><ul>types:<li id>${typesList}</li></ul></div>
      </div>`;
  pokemonDiv.innerHTML = htmlText;
  let lst = document.getElementById("types").children[0].children;
  for (let i = 0; i < lst.length; i++){
    lst[i].setAttribute("id", typeArr[i]);
    lst[i].addEventListener("click", addPokemonNames);
  }

}
searchButton.addEventListener("click", searchPokemon);
