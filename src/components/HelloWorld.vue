<template>
  <div>
    <b-container class="panel">
      <h1 class="alert alert-info">Lista de endereços</h1>
      <b-row>
        <b-col>
          <b-row>

            <b-col>
              <label>Nome:</label>
            </b-col>
            <b-col>
              <input class="input-sm" type="text" v-model="nome"/>
            </b-col>

          </b-row>
          <b-row>

            <b-col>
              <label>Cep</label>
            </b-col>

            <b-col>
              <input class="input-sm" type="number" v-model="cep"/>
            </b-col>

            <b-col>
              <button type="button" class="btn btn-outline-primary btn-sm" @click="getAdress(cep)">Enviar</button>
            </b-col>

          </b-row>
          <b-row>
            {{logradouro}} {{bairro}} {{localidade}}
            {{numero}} {{complemento}}
          </b-row>
          <b-row>

            <b-col>
              <label>Numero:</label>
            </b-col>

            <b-col>
              <input class="input-sm" type="number" v-model="numero"/>
            </b-col>

          </b-row>
          <b-row>

            <b-col>
              <label>Completemento:</label>
            </b-col>

            <b-col>
              <input class="input-sm" type="text" v-model="complemento"/>
            </b-col>


          </b-row>
          <b-row>
            <b-col align-self="end">
              <button class="btn btn-default" v-if="!editar" @click="adicionarEndereco">Adicionar</button>
              <button class="btn btn-default" v-else @click="editaEndereco">Editar</button>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <ul class="list-group">
            <li class="list-group-item" v-for="(local, i) in enderecos" :key="i">
              {{local.nome}} - {{local.cep}}
              <span @click="removerEndereco(i)" class="fas fa-times"></span>
              <span @click="habilitarEdicao(i)" class="fas fa-pencil-alt"></span>
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
            </li>
          </ul>
        </b-col>

      </b-row>
    </b-container>
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
<style scoped>
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

<!--b-container>
  <b-row>
    <b-col> 1 of 3</b-col>
    <b-col> 2 of 3</b-col>
    <b-col> 3 of 3</b-col>
  </b-row>
</b-container-->
