<template>
  <div>
    <div class="panel">
      <h1 class="panel panel-heading">Lista de endereços</h1>
      <div class="row">
        <template v-if="login === true">
          <div class="col">
            
            <div class="row">

              <div class="col-md-6 text-right">
                <label>Cep</label>
              </div>

              <div class="col-md-4">
                <input class="form-control" type="number" v-model="cep"/>
              </div>

              <div class="col-md-2">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="getAdress(cep)">Enviar</button>
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
            <div class="row" v-if="logradouro !== ''">
              <div class="col alert alert-success">
                <span class="font-weight-bold alert-heading">{{logradouro}}</span>
                <br/>
                {{bairro}} {{localidade}} {{numero}} {{complemento}}
              </div>
            </div>
            <div class="row text-right">
              <div class="col">
                <button class="btn btn-default" v-if="!editar" @click="adicionarEndereco">Adicionar</button>
                <button class="btn btn-default" v-else @click="editaEndereco">Editar</button>
              </div>
            </div>
          </div>
          <div class="col">

            <a v-show="enderecos.length > 0" class="btn btn-outline-light" @click="salvarLista">Salvar</a>

            <ul class="list-group">
              <li class="list-group-item" v-for="(local, i) in enderecos" :key="i">
                <div class="card">
                  <div class="card-header">
                    {{local.nome}} - {{local.cep}}
                    <span @click="removerEndereco(i)" class="fas fa-times"></span>
                    <span @click="habilitarEdicao(i)" class="fas fa-pencil-alt"></span>
                  </div>
                  <div class="card-body">
                    {{ local.temperatura }}ºC
                    <span
                      class="wi"
                      :class="{ 'wi-day-sunny': local.temperatura >= 28,
                            'wi-day-cloudy': local.temperatura < 28 && local.temperatura > 18,
                            'wi-cloudy': local.temperatura <= 18}"></span>
                    <br/>
                    À {{ local.distancia }}km
                    <a target="_blank" :href="'https://www.google.com/maps/dir/?api=1&origin=' + userLocalizacao.latitude + ',' + userLocalizacao.longitude + '&destination=' + local.lat + ',' + local.lng">
                      ir agora
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div class="col">
            <input class="" type="text" placeholder="login" v-model="nome">
            <input class="btn btn-sm" type="submit" value="entrar" @click="logar">
            <div class="row">
              <div class="col">

                <span v-if="txtError !== ''"
                      :style="{'background-color': '#ffc107','color':'black'}"
                      class="badge badge-warning font-weight-light">{{txtError}}</span>
              </div>
            </div>
          </div>




        </template>


      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import VueLocalStorage from 'vue-localstorage'
import Cors from 'cors';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: 'HelloWorld',
    data() {
      return {
        login: false,
        editar: false,
        enderecoIndex:'',
        nome: '',
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
        geoLocalTxtError: '',
        userLocalizacao: '',
        distancia:'',
        txtError:'',
        enderecos: []
      }
    },
    created() {
      let storageLocal = JSON.parse(localStorage.getItem('enderecos'));
      console.log(storageLocal);
      if(storageLocal){
        this.enderecos = storageLocal;
      }
      this.getLocation();
    },
    watch: {
      enderecos() {

        localStorage.setItem('enderecos', JSON.stringify(this.enderecos));

        console.log(JSON.parse(localStorage.getItem('enderecos')));

      }
    },
    methods: {
      logar(){
        if(this.nome !== ''){
          this.login = true;
        }else{
          this.txtError = 'Qual o seu nome?'
        }
      },
      salvarLista(){
        if(this.enderecos !== ''){
          axios.post("https://ev-desafio-fe.firebaseio.com/teste.json", this.enderecos).then( ret => {
            console.log(ret);
          });
        }
      },
      distanciaLinear(){
        let vm = this;
        console.log(vm.userLocalizacao.latitude);
        console.log(vm.userLocalizacao.longitude);
        console.log(vm.latitude);
        console.log(vm.longitude);
        //if(vm.latitude !== '' && vm.longitude !== '') {
          vm.distancia = vm.getDistanceFromLatLonInKm(vm.userLocalizacao.latitude, vm.userLocalizacao.longitude, vm.latitude, vm.longitude)
          console.log(vm.distancia);
        //}
      },
      getClima(){
        if(this.latitude === ''){
          console.log('Nao tem lat!');
        }
        console.log(this.latitude);
        let vm = this;
        axios.get("https://api.apixu.com/v1/current.json?key=b423373a80a545d9b67185519182405&q=" +
          this.latitude +
          "," +
          this.longitude).then(result => {
            console.log(this.latitude);
            console.log(this.longitude);
            console.log(result.data.current.temp_c);
            this.temperatura = result.data.current.temp_c;
            console.log(this.temperatura);
          }).then( ret3 =>{
          // vm.distanciaLinear();
          this.passandoDados();
          console.log('pegou distancia');
        });
      },
      getLatLong() {
        console.log('cheguei em Pegnado lat e log');
        let vm2 = this;
        let lat = '';
        let lng = '';
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
          vm2.numero +
          '+' +
          vm2.logradouro +
          ',+' +
          vm2.localidade +
          '&key=AIzaSyBe993AXRz_3kvv88GVtwhmQH6_FpHjbFk').then( ret => {
          let vm = this;
            console.log(ret);
            console.log(vm.latitude);
            console.log(vm.longitude);
            this.longitude = ret.data.results[0].geometry.location.lng;
            this.latitude = ret.data.results[0].geometry.location.lat;
            console.log('lat response', this.latitude);
            console.log('lng response', this.longitude);
        }).then( ret2 =>{
          vm2.getClima();
          vm2.distanciaLinear();
          console.log('pegou clima');
        });
        console.log(this.latitude);
        console.log(this.longitude);
      },
      getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
          this.geoLocalTxtError = "Geolocalização não suportada por este navegador!";
        }
      },
      showPosition(position) {
        console.log(position);
        this.userLocalizacao = {
          "latitude": position.coords.latitude,
          "longitude": position.coords.longitude
        };
      },
      editaEndereco(){
        this.getLatLong();
        //this.distanciaLinear();
        //this.getClima();
        this.enderecos[this.enderecoIndex] = {
          nome: this.nome,
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
        };
        this.limparInfos();
        this.editar = false;

      },
      habilitarEdicao(index){
        this.enderecoIndex = index;
        this.editar = true;
        console.log(this.enderecos[index]);
          this.nome = this.enderecos[index].nome;
          this.cep = this.enderecos[index].cep;
          this.localidade = this.enderecos[index].localidade;
          this.logradouro = this.enderecos[index].logradouro;
          this.bairro = this.enderecos[index].bairro;
          this.numero = this.enderecos[index].numero;
          this.complemento = this.enderecos[index].complemento;
          this.uf = this.enderecos[index].uf;
      },
      removerEndereco(index) {
        this.enderecos.splice(index, 1);
      },
      adicionarEndereco() {
        console.log('Pega lat e long');
        this.getLatLong();



      },
      passandoDados(){
        this.enderecos.unshift({
          nome: this.nome,
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
        this.limparInfos();
      },
      limparInfos() {
        console.log('limpei tudo');
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
      getAdress(cep) {
        // console.log(cep);
        let vm = this;
        axios.get('https://viacep.com.br/ws/' + cep + '/json/').then(ret => {
          // console.log(ret);
          vm.logradouro = ret.data.logradouro;
          vm.bairro = ret.data.bairro;
          vm.localidade = ret.data.localidade;
          vm.uf = ret.data.uf;
        })
      },
      getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        let R = 6371; // Radius of the earth in km
        let dLat = this.deg2rad(lat2-lat1); // deg2rad below
        let dLon = this.deg2rad(lon2-lon1);
        let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.floor(R * c);
      },
      deg2rad(deg) {
        return deg * (Math.PI/180)
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

$cyan:    #00bdb1;

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
