<template>
  <div>
    <div class="panel">
      <div class="panel panel-heading">
        <div class="row">
          <div class="col-7 text-right"><h1 class="d-inline">Lista de endereços </h1></div>
          <div class="col-5 text-right"><i v-if="login" class="fas fa-sign-out-alt" @click="logout"></i></div>
        </div>
      </div>
      <template v-if="login">
        <div class="row">
          <div class="col">
            <div class="row">

              <div class="col-md-6 text-right">
                <label>Cep</label>
              </div>

              <div class="col-md-4">
                <input class="form-control" type="number" v-model="cep"/>
              </div>

              <div class="col-md-2">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="pegarEndereco(cep)">Enviar</button>
              </div>

            </div>
            <div class="row">

              <div class="col text-right">
                <label>Número:</label>
              </div>

              <div class="col">
                <input class="form-control" type="number" v-model="numero"/>
              </div>

            </div>
            <div class="row">

              <div class="col text-right">
                <label>Completemento:</label>
              </div>

              <div class="col">
                <input class="form-control" type="text" v-model="complemento"/>
              </div>


            </div>
          </div>
          <div class="col">
            <div class="row" v-if="logradouro !== ''">
              <div class="col alert alert-success">
                <span class="font-weight-bold alert-heading">{{logradouro}}</span>
                <br/>
                {{bairro}} {{localidade}} {{numero}} {{complemento}}
              </div>
            </div>
            <div class="row" v-else>
              <div class="col alert alert-info">
                <span class="font-weight-bold alert-heading">Adicione um endereço ao lado digitando seu cep!</span>
                <br/>
                Caso tenha algum problema, entre em <a target="_blank" href="https://www.linkedin.com/in/igor-imperiali-823958102/">contato!</a>
              </div>
            </div>
            <div class="row text-right">
              <div class="col">
                <button class="btn btn-default" v-if="!liberarEdicao" @click="adicionarEndereco">Adicionar</button>
                <button class="btn btn-default" v-else @click="editaEndereco">Editar</button>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <div class="row">
          <div class="col">
            <p>Todas as listas</p>
            <ul class="list-group">
              <li class="list-group-item" v-for="(local, i) in enderecodb" :key="local['.key']">
                <div class="card">
                  <div class="card-header">
                    <span @click="teste(local)" >{{local.localidade}} - {{local.cep}}</span>
                    <template v-if="local.id === id">
                      <span @click="removerEndereco(local)" class="fas fa-times"></span>
                      <span @click="habilitarEdicao(local, local['.key'])" class="fas fa-pencil-alt"></span>
                    </template>
                  </div>
                  <div class="card-body">
                    {{ local.logradouro }}, {{ local.numero }} <br>
                    {{ local.temperatura }}ºC
                    <span
                      class="wi"
                      :class="{ 'wi-day-sunny': local.temperatura >= 28,
                            'wi-day-cloudy': local.temperatura < 28 && local.temperatura > 18,
                            'wi-cloudy': local.temperatura <= 18}"></span>
                    -
                    À {{ local.distancia }}km -
                    <a target="_blank" :href="'https://www.google.com/maps/dir/?api=1&origin=' + userLocalizacao.latitude + ',' + userLocalizacao.longitude + '&destination=' + local.lat + ',' + local.lng">
                      ir agora
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="col">
          <!--a v-show="enderecos.length > 0" class="btn btn-outline-light" @click="salvarLista">Salvar</a-->
          <p>Sua lista</p>
          <ul class="list-group">
            <li class="list-group-item" v-for="(local, i) in enderecos" :key="i">
              <div class="card">
                <div class="card-header">
                  <span @click="teste(local)" >{{local.localidade}} - {{local.cep}}</span>
                </div>
                <div class="card-body">
                  {{ local.logradouro }}, {{ local.numero }} <br>
                  {{ local.temperatura }}ºC
                  <span
                    class="wi"
                    :class="{ 'wi-day-sunny': local.temperatura >= 28,
                          'wi-day-cloudy': local.temperatura < 28 && local.temperatura > 18,
                          'wi-cloudy': local.temperatura <= 18}"></span>
                  -
                  À {{ local.distancia }}km -
                  <a target="_blank" :href="'https://www.google.com/maps/dir/?api=1&origin=' + userLocalizacao.latitude + ',' + userLocalizacao.longitude + '&destination=' + local.lat + ',' + local.lng">
                    ir agora
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
        </div>
      </template>
      <template v-else>
        <div class="row">
          <div class="col">
          <input class="" type="text" placeholder="login" v-model="email">
          <input class="" type="password" placeholder="senha" v-model="senha">
          <input class="btn btn-sm" type="submit" value="entrar" @click="logar">
          <input class="btn btn-sm" type="submit" value="cadastrar" @click="cadastrar">
          <div class="row">
            <div class="col">

              <span v-if="loginErros.emailMsg !== ''"
                    :style="{'background-color': '#ffc107','color':'black'}"
                    class="badge badge-warning font-weight-light">{{loginErros.emailMsg}}</span>
              <span v-if="loginErros.senhaMsg !== ''"
                    :style="{'background-color': '#ffc107','color':'black'}"
                    class="badge badge-warning font-weight-light">{{loginErros.senhaMsg}}</span>
              <span v-if="loginErros.outraMsg !== ''"
                    :style="{'background-color': '#ffc107','color':'black'}"
                    class="badge badge-warning font-weight-light">{{loginErros.outraMsg}}</span>
            </div>
          </div>
        </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

  /** importando o conteudo necessário */
import axios from 'axios';
import VueLocalStorage from 'vue-localstorage'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { enderecoRef } from '../firebase';
import Firebase from 'firebase';

  /** Vue */
export default {
  name: 'Home', /** Nome do componente */
    data() {    /** Variaveis do projeto */
      return {
        login: false,           /** "Validador" de login */
        liberarEdicao: false,          /** Libera a edição */
        editar: false,                 /** Habilita a edição */
        geoLocalTxtError: '',
        userLocalizacao: '',
        enderecoIndex:'',
        chaveDeEdicao:'',
        id:'',
        cep: '',
        logradouro: '',
        complemento: '',
        bairro: '',
        localidade: '',
        uf: '',
        numero: '',
        latitude:'',
        longitude:'',
        temperatura:'',
        distancia:'',
        txtError:'',
        email: '',
        senha: '',
        loginErros:{
          emailMsg:'',
          senhaMsg:'',
          outraMsg:''
        },
        enderecodb:'',
        //filtro:'',
        enderecos: []           /** Array de endereços */
      }
    },
    firebase: {                  /** Referenciando Firebase */
      enderecodb: enderecoRef
      // enderecodb: enderecoRef.orderByChild('id').equalTo(Firebase.auth().currentUser.uid)
    },
    created() {
      /** Verifica se tem id de usuario e agraga a variavel global */
      if(Firebase.auth().currentUser.uid){
        this.id = Firebase.auth().currentUser.uid;
        this.login = true;
      }else {
        this.id = '';
        this.login = false;
      }
      /** Verificar localstorage ao ciclo de vida do Vue chegar em Created */
      let storageLocal = JSON.parse(localStorage.getItem('enderecos'));
      if(storageLocal !== null){         /** Tendo conteudo no localstorage, loga e popula a lista de enderecos */
        if(storageLocal.length === 0){
          return localStorage.clear();
        }
      this.enderecos = storageLocal;
      this.login = true;
      }
      this.pegarLocalizacao();
      console.log(this.userLocalizacao);
    },
    watch: {
      /** Observaa o array de enderecos, e a cada evento, atualiza o localStorage */
      enderecos() {
        localStorage.setItem('enderecos', JSON.stringify(this.enderecos));
      }
    },
    methods: {
      /** Separando lista do usuário atual para todas as listas do sistema */
      popularListaComEnderecosDoUsuario(){
        let filtro = enderecoRef.orderByChild('id').equalTo(Firebase.auth().currentUser.uid);
        filtro.on('value', ret=>{
          let vm = this;
          vm.enderecos = ret.val()
        });
      },
      /** Simples metodo de logout via Firebase */
      logout(){
        Firebase.auth().signOut().then();
        this.login = false;
      },
      /** Login via Firebase */
      logar(){
        let vm = this;
        let passou = true;

        if(this.validadorDeLogin()){
          Firebase.auth().signInWithEmailAndPassword(this.email, this.senha).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            vm.loginErros.outraMsg = 'Erro ao logar! Verifique seu e-mail e senha, ou cadastre-se!';
            passou = false
          }).then( ret => {
            if(passou === true){
              this.login = true;
              this.loginErros.outraMsg = '';
              console.log(Firebase.auth().currentUser.uid);
              this.id = Firebase.auth().currentUser.uid;
              this.popularListaComEnderecosDoUsuario();
            }
          });
        }
      },
      /** Cadastro via Firebase */
      cadastrar(){
        let passou = true;
        let vm = this;

        if(this.validadorDeLogin()){
          Firebase.auth().createUserWithEmailAndPassword(this.email, this.senha).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            vm.loginErros.outraMsg = 'Erro ao se cadastrar! Já não tem um cadastro?';
            passou = false
          }).then( ret => {
            if(passou === true){
              this.login = true;
              this.loginErros.outraMsg = '';
              console.log(Firebase.auth().currentUser.uid);
              this.id = Firebase.auth().currentUser.uid;
              this.popularListaComEnderecosDoUsuario();
            }
          });
        }
      },
      /** Faz a validação dos inputs antes de executar a autenticação */
      validadorDeLogin(){
        let count = 0;
        if(this.email !== '' && this.email.indexOf('@') > -1 && this.email.indexOf('.') > -1){
          this.loginErros.emailMsg = '';
          count ++;
        }else{
          this.loginErros.emailMsg = 'Seu e-mail não está correto!';
          count --;
        }
        if(this.senha !== '' && this.senha.length >= 6) {
          this.loginErros.senhaMsg = '';
          count ++
        }else{
          this.loginErros.senhaMsg = 'A senha precisa ter 6 digitos ou mais!';
          count --
        }
        return count === 2
      },
      /** Metodo para enviar os dados de endereço para o Firebase */
      enviarProFirebase(){
        enderecoRef.push({
          id: this.id,
          cep: this.cep,
          localidade: this.localidade,
          logradouro: this.logradouro,
          bairro: this.bairro,
          numero: this.numero,
          complemento: this.complemento,
          uf: this.uf,
          lat: this.latitude,
          lng: this.longitude,
          distancia: this.distancia,
          temperatura: this.temperatura
        });
      },
      /** Agrega a propriedade Distancia, a distancia em linha reta do endereço cadastrado para o local atual do usuario */
      distanciaLinear(){
        this.distancia = this.pegarDistanciaComLatLongEmKm(this.userLocalizacao.latitude, this.userLocalizacao.longitude, this.latitude, this.longitude)
      },
      /** Metodo para resgatar a temperatura atual do endereço cadastrado */
      pegarClima(){

        axios.get("https://api.apixu.com/v1/current.json?key=b423373a80a545d9b67185519182405&q=" +
          this.latitude +
          "," +
          this.longitude).then(result => {
            this.temperatura = result.data.current.temp_c;

          }).then( ret2 => {
            this.criarOuEditar(this.editar);
        }).catch( ret => {
            console.log('deu ruim na api de clima...', ret);
            this.temperatura = 'erro';
            console.log('Indo sem clima =/');
            this.criarOuEditar(this.editar);
        });
      },
      /** Metodo para pegar a Latitude e Longitude do endereço cadastrado */
      pegarLatLong() {
        let vm = this;
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
          vm.numero +
          '+' +
          vm.logradouro +
          ',+' +
          vm.localidade +
          '&key=AIzaSyBe993AXRz_3kvv88GVtwhmQH6_FpHjbFk').then( ret => {
            this.longitude = ret.data.results[0].geometry.location.lng;
            this.latitude = ret.data.results[0].geometry.location.lat;
        }).then( ret2 =>{
          vm.distanciaLinear();
          vm.pegarClima();
        });
      },
      /** Metodo para detectar a localização atual do usuário */
      pegarLocalizacao() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.mostrarLocalizacao);
        } else {
          this.geoLocalTxtError = "Geolocalização não suportada por este navegador!";
        }
      },
      /** Metodo para agregar a Latitude e a Longitude atual do usuario as variaveis globais */
      mostrarLocalizacao(position) {
        this.userLocalizacao = {
          "latitude": position.coords.latitude,
          "longitude": position.coords.longitude
        };
      },
      /** Leva os dados cadastrados para os inputs para começar a edição do endereço */
      habilitarEdicao(local, chave){
        this.chaveDeEdicao = chave;
        this.liberarEdicao = true;
        this.cep = local.cep;
        this.localidade = local.localidade;
        this.logradouro = local.logradouro;
        this.bairro = local.bairro;
        this.numero = local.numero;
        this.complemento = local.complemento;
        this.uf = local.uf;
      },
      /** Exclui um endereço especifico. Faltando implementar ao firebase */
      removerEndereco(local) {
        enderecoRef.child(local['.key']).remove();
      },
      /** Metodo para edicar um endereço especifico */
      editaEndereco(){
        this.pegarLatLong();
        this.editar = true;
        this.liberarEdicao = false;
      },
      /** Adiciona um endereço novo a lista de endereços */
      adicionarEndereco() {
        if(this.cep.length === 8){
          this.pegarLatLong();
          this.editar = false;
        }
      },
      /** Metodo que detecta se a ação do usuário será de editar ou criar um endereço */
      criarOuEditar(descisao){
        if(!descisao){
          this.passandoDados()
        }else{
          this.editandoDados()
        }
      },
      /** Altera os valores de um endereço especifico */
      editandoDados(){
        enderecoRef.child(this.chaveDeEdicao).update({
          id: this.id,
          cep: this.cep,
          localidade: this.localidade,
          logradouro: this.logradouro,
          bairro: this.bairro,
          numero: this.numero,
          complemento: this.complemento,
          uf: this.uf,
          lat: this.latitude,
          lng: this.longitude,
          distancia: this.distancia,
          temperatura: this.temperatura
        });
        this.popularListaComEnderecosDoUsuario();
        this.limparInfos();
      },
      /** Agrega mais um endereço a lista */
      passandoDados(){
        this.enviarProFirebase();
        this.popularListaComEnderecosDoUsuario();
        this.limparInfos();
      },
      /** Limpa os campos */
      limparInfos() {
        this.cep = '';
        this.localidade = '';
        this.logradouro = '';
        this.bairro = '';
        this.numero = '';
        this.complemento = '';
        this.uf = '';
        this.latitude = '';
        this.longitude = '';
        this.distancia = '';
        this.temperatura = '';
      },
      /** Recupera o endereço através do CEP */
      pegarEndereco(cep) {
        let vm = this;
        axios.get('https://viacep.com.br/ws/' + cep + '/json/').then(ret => {
          vm.logradouro = ret.data.logradouro;
          vm.bairro = ret.data.bairro;
          vm.localidade = ret.data.localidade;
          vm.uf = ret.data.uf;
        })
      },
      /** Calcula a distancia entre o endereço atual do usuário e o endereço cadastrado */
      pegarDistanciaComLatLongEmKm(lat1,lon1,lat2,lon2) {
        let R = 6371; // Raio da terra em km
        let dLat = this.deg2rad(lat2-lat1); // deg2rad abaixo
        let dLon = this.deg2rad(lon2-lon1);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.floor(R * c);
      },
      /** Converte o número em graus ao equivalente em radianos */
      deg2rad(deg) {
        return deg * (Math.PI/180)
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

$cyan:    #00bdb1;
$alert-border-radius: 44px;

.alert{
  border-radius: $alert-border-radius;
}
.panel-heading {
  background-color: $cyan;
  color: black;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
