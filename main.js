function initApplication() {
	conteudo = {};
	if(	!window.localStorage.getItem('dadosJson'))
	{
		conteudo ={
			listaRemedios : [],
		};
	}else{
		conteudo = load();
	}
	const intervalo = setInterval(function() {
		save(conteudo)
	}, 5*60*1000);
	montaTabela();
}

class remedioEstoque{
	constructor(id, nome, comprimidos,  tipoReceita, ultimoComprimidoTomado = ""){
		this.id = id;
		this.nome = nome; //nome do remédio
		this.comprimidos = comprimidos; //quantidade de comprimidos restantes
		this.tipoReceita = tipoReceita; //Sem Receita, Receita Simples, Receita Especial
		this.ultimoComprimidoTomado = ultimoComprimidoTomado; //data do último
	}
}
function addRemedio() {
	let nome = window.prompt("Nome do remédio ou do princípio ativo: ");

	let comprimidos = window.prompt("Quantidade ATUAL de comprimidos: ");
	let tipoReceita = "Sem Receita"
	if(window.confirm("Precisa de receita? ")){
		tipoReceita = "Receita Simples";
		if (window.confirm("Receita especial (fica retida da farmácia)? ")) {
			tipoReceita = "Receita Especial";
		}
	}
	if (conteudo.listaRemedios.length) {
		id = conteudo.listaRemedios.at(-1).id + 1;
	}else{
		id = 1;
	}
	let remedio = new remedioEstoque(id, nome, comprimidos, tipoReceita);
	conteudo.listaRemedios.push(remedio);
	save(conteudo);
	montaTabela();
}
function subRemedio() {
	
}

function buscaRemedio(idRemedio){
	let arrayIndex = conteudo.listaRemedios.findIndex(function(a,i){return a.id == idRemedio});
	return conteudo.listaRemedios[arrayIndex];
}

function remedioTomado(idRemedio) {
	let remedio = buscaRemedio(idRemedio);
	if (remedio.comprimidos <=0)
	{
		window.alert('Não foi encontrado remédios');

	}else
	{
		remedio.comprimidos --;
		remedio.ultimoComprimidoTomado = new Date().toLocaleString('pt-br');

		if (remedio.tipoReceita == "Receita Especial" && remedio.comprimidos <= 15) {
			window.alert('Remédio controlado acabando, fique atento para renovar a receita!');
		}else if (remedio.comprimidos <=7) {
			window.alert('Lembre-se de comprar mais remédios!')
		}
		atualizaConteudo(remedio)

	}
	
}
function reporRemedio(idRemedio) {
	let remedio = buscaRemedio(idRemedio);
	let caixa = parseInt(window.prompt('Quantas caixas foram adquiridas?'));
	if (caixa <= 0 )
	{
		if (window.confirm('Remédio sem caixa?')) {
			caixa = 1;
		}
	}
	let comprido = parseInt(window.prompt('Quantos comprimidos por caixa?'));
	remedio.comprimidos = parseInt (remedio.comprimidos) + (caixa * comprido);
	atualizaConteudo(remedio)
}
// function download(content, fileName, contentType) {
//     var a = document.createElement("a");
//     var file = new Blob([content], {type: contentType});
//     a.href = URL.createObjectURL(file);
//     a.download = fileName;
//     a.click();
// }
//download(jsonData, 'json.txt', 'text/plain');
function atualizaConteudo(remedio) {
	let arrayIndex = conteudo.listaRemedios.findIndex(function(a,i){return a.id == remedio.id});
	conteudo.listaRemedios[arrayIndex] = remedio;
	montaTabela();
}
function save(conteudo){
	window.localStorage.setItem('dadosJson', JSON.stringify(conteudo));
}
function load(){
	return JSON.parse(window.localStorage.getItem('dadosJson'));
}

function montaTabela(){

	let mainDiv = document.getElementById('tbl_main');
	let header = "";
	let rows = ""
	header = "<div class='row'>";
	header += "<div class='nome column'> " + "Nome Remédio" + "</div>";
	header += "<div class='comprimidos column'> " + "Qtd Comprimidos" + "</div>";
	header += "<div class='tipoReceita column' >" + "Tipo de Receita" + "</div>";
	header += "<div class='ultimoComprimidoTomado column' >" + "Último comprimido Tomado" + "</div>";
	header += "<div class='tomarRemedio column' >" + "_" + "</div>";
	header += "<div class='remedioComprado column' >" + "_" + "</div>";

	header += "</div>";

	if (conteudo.listaRemedios.length) {
		conteudo.listaRemedios.forEach(function(a,i){
			//let current = new remedioEstoque(a.id, a.nome, a.comprimidos, a.tipoReceita, a.ultimoComprimidoTomado);
			rows += retornaLinhaRemedio(a.id);
		});
	}
	mainDiv.innerHTML = header + rows;

}
function retornaLinhaRemedio(idRemedio) {
	let remedio = buscaRemedio(idRemedio);
	let ret = "<div class='row' id='id_" + remedio.id + "'>";
	ret += "<div class='nome column'> " + remedio.nome + "</div>";
	ret += "<div class='comprimidos column'> " + remedio.comprimidos + "</div>";
	ret += "<div class='tipoReceita column' >" + remedio.tipoReceita + "</div>";
	ret += "<div class='ultimoComprimidoTomado column' >" + remedio.ultimoComprimidoTomado + "</div>";
	ret += "<div class='tomarRemedio column' >" + "<button onclick='remedioTomado(" + remedio.id + ");' >tomar remédio</button>" + "</div>";
	ret += "<div class='remedioComprado column' >" + "<button onclick='reporRemedio(" + remedio.id + ");'>repor remédio</button>" + "</div>";
	ret += "</div>";

	return ret;
}	
